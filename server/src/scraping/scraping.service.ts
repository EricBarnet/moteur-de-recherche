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

  async scrapeBooks(): Promise<void> {
    const apiUrl = 'https://gutendex.com/books/';
    const response$ = this.httpService.get(apiUrl);
    const response = await lastValueFrom(response$);

    if (response.status === 200 && response.data.results.length > 0) {
      // Prendre seulement les 10 premiers livres
      const books = response.data.results.slice(0, 10);
      for (const book of books) {
        // Transformer et insérer les données ici
        await this.prismaService.livre.create({
          data: {
            titre: book.title,
            auteur:
              book.authors && book.authors.length > 0
                ? book.authors[0].name
                : 'Inconnu',
            contenuUrl: book.formats['text/plain'] || 'URL non disponible',
            // Ajoutez ici d'autres champs si nécessaire
          },
        });
      }
    } else {
      console.error(`Failed to scrape books: ${response.status}`);
    }
  }
}
