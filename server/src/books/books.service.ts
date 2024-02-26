// src/books/books.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async addBook(bookId: number): Promise<void> {
    // Vérifier si le livre existe déjà dans la base de données
    const existingBook = await this.prisma.book.findUnique({
      where: {
        id: bookId, // ou utilisez un autre champ unique approprié pour la vérification
      },
    });

    // Si le livre existe déjà, arrêter l'exécution et potentiellement renvoyer une réponse
    if (existingBook) {
      throw new Error(`A book with the id ${bookId} already exists.`);
    }
    const metadataUrl = `https://gutendex.com/books/${bookId}`;
    const metadataResponse = await axios.get(metadataUrl);
    const bookDetails = metadataResponse.data;
    const bookContentUrl = `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.txt`;
    const contentResponse = await axios.get(bookContentUrl);
    const bookContent = contentResponse.data;
    // Créer un nouveau livre avec les métadonnées récupérées
    const book = await this.prisma.book.create({
      data: {
        title: bookDetails.title,
        author: bookDetails.authors.map((a) => a.name).join(', '),
        publicationDate: bookDetails.publicationDate,
        language: bookDetails.language,
      },
    });
    console.log(bookContent);
    const wordIndex = this.tokenizeAndIndex(bookContent);
    await this.storeUniqueWords(book.id, wordIndex);
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
        Book: true, // Relation définie entre les mots et
      },
    });
    return results.map((result) => result.Book);
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
    const wordsToStore = Object.keys(wordIndex).map((wordText) => ({
      bookId,
      text: wordText,
      frequency: wordIndex[wordText],
    }));
    await this.prisma.word.createMany({
      data: wordsToStore,
      skipDuplicates: true,
    });
  }
}
