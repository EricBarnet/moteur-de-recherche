import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}
  async addBooks(bookIds: number[]): Promise<void> {
    const promises = bookIds.map((bookId) => this.addBook(bookId));
    await Promise.all(promises);
  }

  public async addBook(bookId: number): Promise<void> {
    console.time('addBook total');
    console.time('checking existing book');
    // Vérifier si le livre existe déjà dans la base de données
    const existingBook = await this.prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });
    console.timeEnd('checking existing book');

    // Si le livre existe déjà, arrêter l'exécution et potentiellement renvoyer une réponse
    if (existingBook) {
      console.log(`A book with the id ${bookId} already exists.`);
      return;
    }
    console.time('fetching metadata and content');
    try {
      const [metadataResponse, contentResponse] = await Promise.all([
        axios.get(`https://gutendex.com/books/${bookId}`),
        axios.get(
          `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.txt`,
        ),
      ]);
      const bookDetails = metadataResponse.data;
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
      console.timeEnd('creating book record');
      console.time('indexing and storing words');
      const wordIndex = this.tokenizeAndIndex(bookContent);
      await this.storeUniqueWords(book.id, wordIndex);
      console.timeEnd('indexing and storing words');
      console.timeEnd('addBook total');
    } catch (error) {
      console.error(`Content for bookid ${bookId} not found or not reading`);
    }
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
        },
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
    const uniqueWords = Object.keys(wordIndex);

    const existingWords = await this.prisma.word.findMany({
      where: { text: { in: uniqueWords } },
      select: { id: true, text: true },
    });
    // Creer un dictionnaire qui accede rapidement aux IDs des mots existants
    const wordDictionary = existingWords.reduce((dict, word) => {
      dict[word.text] = word.id;
      return dict;
    }, {});

    const newWords = uniqueWords.filter((word) => !wordDictionary[word]);

    // cette methode insere tous les mots uniques en une seule opération et skip les duplicatas
    if (newWords.length > 0) {
      await this.prisma.word.createMany({
        data: newWords.map((text) => ({ text })),
        skipDuplicates: true,
      });
    }
    // Associe les mots au livre avec les bon ids
    const updatedExistingWords = await this.prisma.word.findMany({
      where: { text: { in: newWords } },
    });

    // Mise a jour la dictionnaire avec les nouveaux mots
    updatedExistingWords.forEach((word) => {
      wordDictionary[word.text] = word.id;
    });

    for (const [text, frequency] of Object.entries(wordIndex)) {
      await this.prisma.bookWord.upsert({
        where: {
          bookId_wordId: {
            bookId,
            wordId: wordDictionary[text],
          },
        },
        update: { frequency },
        create: {
          bookId,
          wordId: wordDictionary[text],
          frequency,
        },
      });
    }
  }
}
