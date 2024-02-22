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

    if (response.data && response.data.results.length > 0) {
      const books = response.data.results.slice(0, 10);
      for (const book of books) {
        const formats = book.formats || {};
        const textUrl =
          formats['text/plain'] || formats['text/html'] || 'URL non disponible';

        // Utilisez Prisma pour insérer les données dans la base de données
        await this.prismaService.livre.create({
          data: {
            titre: book.title,
            auteur: book.authors[0].name || 'Inconnu',
            contenuUrl: textUrl, // Ici nous utilisons la nouvelle URL trouvée
          },
        });
      }
    }
  }
}
