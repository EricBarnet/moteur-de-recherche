// src/books/books.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async addBook(bookId: number): Promise<void> {
    console.time('addBook total');
    console.time('checking existing book');
    // Vérifier si le livre existe déjà dans la base de données
    const existingBook = await this.prisma.book.findUnique({
      where: {
        id: bookId, // ou utilisez un autre champ unique approprié pour la vérification
      },
    });
    console.timeEnd('checking existing book');

    // Si le livre existe déjà, arrêter l'exécution et potentiellement renvoyer une réponse
    if (existingBook) {
      console.log(`A book with the id ${bookId} already exists.`);
      return;
    }
    console.time('fetching metadata and content');
    const metadataUrl = `https://gutendex.com/books/${bookId}`;
    const metadataResponse = await axios.get(metadataUrl);
    const bookDetails = metadataResponse.data;
    const bookContentUrl = `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.txt`;
    const contentResponse = await axios.get(bookContentUrl);
    const bookContent = contentResponse.data;
    console.timeEnd('fetching metadata and content');

    console.time('creating book record');
    // Créer un nouveau livre avec les métadonnées récupérées
    const book = await this.prisma.book.create({
      data: {
        id: bookId,
        title: bookDetails.title,
        author: bookDetails.authors.map((a) => a.name).join(', '),
        language: bookDetails.languages.join(', '),
      },
    });
    // console.log(bookContent);
    console.timeEnd('creating book record');
    console.time('indexing and storing words');
    const wordIndex = this.tokenizeAndIndex(bookContent);
    await this.storeUniqueWords(book.id, wordIndex);
    console.timeEnd('indexing and storing words');
    console.timeEnd('addBook total');
  }
  async searchBooks(query: string): Promise<any> {
    const words = query.toLowerCase().split(/\W+/);
    const results = await this.prisma.word.findMany({
      where: {
        text: {
          in: words,
        },
      },
      include: {
        books: {
          include: {
            Book: true,
          },
        }, // Relation définie entre les mots et
      },
    });
    return results.map((result) =>
      result.books.map((bookWord) => bookWord.Book),
    );
  }

  private tokenizeAndIndex(text: string): Record<string, number> {
    const words = text.toLowerCase().split(/\W+/);
    const index: Record<string, number> = {};
    words.forEach((word) => {
      if (word) index[word] = (index[word] || 0) + 1;
    });
    return index;
  }

  private async storeUniqueWords(
    bookId: number,
    wordIndex: Record<string, number>,
  ): Promise<void> {
    const wordsToCreate = [];

    const bookWordsToUpsert = [];

    for (const [wordText, frequency] of Object.entries(wordIndex)) {
      wordsToCreate.push({ text: wordText });
      bookWordsToUpsert.push({
        text: wordText,
        where: { bookId_wordId: { bookId, wordId: -1 } }, // -1 est un placeholder
        create: { bookId, wordId: -1, frequency }, // -1 est un placeholder
        update: { frequency },
      });
    }

    // cette methode insere tous les mots uniques en une seule opération et skip les duplicatas
    await this.prisma.word.createMany({
      data: wordsToCreate,
      skipDuplicates: true,
    });

    // Pour chaque relation bookWord (donc la table de jointure qui lie la table book et word), ça trouve l'id du mot correspondant
    for (const bookWord of bookWordsToUpsert) {
      const word = await this.prisma.word.findUnique({
        where: { text: bookWord.text },
      });
      if (word) {
        // Maintenant que vous avez l'ID du mot, vous pouvez effectuer l'opération upsert
        await this.prisma.bookWord.upsert({
          where: { bookId_wordId: { bookId, wordId: word.id } },
          create: {
            bookId,
            wordId: word.id,
            frequency: bookWord.update.frequency,
          },
          update: { frequency: bookWord.update.frequency },
        });
      }
    }
  }
}
