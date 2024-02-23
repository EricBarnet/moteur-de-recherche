import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ScrapingService {
  constructor(
    private httpService: HttpService,
    private prismaService: PrismaService,
  ) {}

  async fetchAndCountWords(
    bookId: number, // Utilisation de l'ID du livre pour construire l'URL
  ): Promise<{ wordCount: number; words: string[] }> {
    // Construction de l'URL à partir de l'ID du livre
    const textUrl = `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.txt`;
    try {
      const textResponse$ = this.httpService.get(textUrl, {
        responseType: 'text',
      });
      const textResponse = await lastValueFrom(textResponse$);
      const words = textResponse.data.match(/\w+/g) || [];
      return { wordCount: words.length, words };
    } catch (error) {
      console.error(
        `Failed to fetch or count words for book ID ${bookId}:`,
        error,
      );
      return { wordCount: 0, words: [] };
    }

    // Simple word count logic (might need to be more sophisticated depending on the actual text structure)
  }

  async scrapeBooks(): Promise<void> {
    const apiUrl = 'https://gutendex.com/books/';
    const response$ = this.httpService.get(apiUrl);
    const response = await lastValueFrom(response$);

    if (response.data && response.data.results.length > 0) {
      for (const book of response.data.results) {
        const formats = book.formats || {};
        const textUrl = formats['text/plain'] || formats['text/html'];

        if (book.id) {
          const { wordCount, words } = await this.fetchAndCountWords(textUrl);

          if (wordCount >= 10000) {
            // Insert the book into the Livre table
            const createdBook = await this.prismaService.livre.create({
              data: {
                titre: book.title,
                auteur: book.authors[0].name || 'Inconnu',
                contenuUrl: textUrl,
              },
            });

            // Insert words into the InvertedIndex
            const wordOccurrences = words.reduce((acc, word) => {
              acc[word] = (acc[word] || []).concat(createdBook.id);
              return acc;
            }, {});

            // Transform wordOccurrences into an array of { mot, occurrences }
            const invertedIndexEntries = Object.keys(wordOccurrences).map(
              (mot) => ({
                mot,
                occurrences: JSON.stringify(
                  wordOccurrences[mot].map((id) => ({
                    livreId: id,
                    positions: [],
                  })),
                ),
              }),
            );

            // Batch insert into InvertedIndex
            await this.prismaService.invertedIndex.createMany({
              data: invertedIndexEntries,
              skipDuplicates: true, // Assuming mot is a unique identifier
            });
          }
        }
      }
    }
  }
}
