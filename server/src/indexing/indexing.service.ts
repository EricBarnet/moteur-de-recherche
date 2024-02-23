import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ScrapingService } from 'src/scraping/scraping.service';
@Injectable()
export class IndexingService {
  constructor(
    private prismaService: PrismaService,
    private scrapingService: ScrapingService,
    private httpService: HttpService,
  ) {}

  async populateInvertedIndex(): Promise<void> {
    // Obtenez tous les livres
    const livres = await this.prismaService.livre.findMany();

    // Pour chaque livre, analysez son contenu
    for (const livre of livres) {
      const { words } = await this.scrapingService.fetchAndCountWords(
        livre.contenuUrl,
      );

      // Créez ou mettez à jour l'entrée de l'InvertedIndex pour chaque mot
      for (const word of words) {
        let occurrences = [];
        // Vérifiez si le mot existe déjà dans l'InvertedIndex
        const invertedEntry = await this.prismaService.invertedIndex.findUnique(
          {
            where: { mot: word },
          },
        );

        if (invertedEntry) {
          occurrences = JSON.parse(invertedEntry.occurrences as string);
          occurrences.push({
            livreId: livre.id,
            positions: [], // Vous devrez remplir les positions si nécessaire
          });
          await this.prismaService.invertedIndex.update({
            where: { mot: word },
            data: { occurrences: JSON.stringify(occurrences) },
          });
        } else {
          // Créez une nouvelle entrée dans l'InvertedIndex
          await this.prismaService.invertedIndex.create({
            data: {
              mot: word,
              occurrences: JSON.stringify([
                {
                  livreId: livre.id,
                  positions: [
                    /* positions du mot */
                  ],
                },
              ]),
            },
          });
        }
      }
    }
  }
}
