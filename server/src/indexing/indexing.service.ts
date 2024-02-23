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
    console.log('Livres obtenu : ', livres);
    // Pour chaque livre, analysez son contenu
    for (const livre of livres) {
      console.log('test');
      try {
        if (livre.contenuUrl && livre.contenuUrl.startsWith('http')) {
          const { words } = await this.scrapingService.fetchAndCountWords(
            livre.id,
          );
          console.log('Mots obtenu : ', words);

          for (const word of words) {
            let occurrences = [];
            // Vérifiez si le mot existe déjà dans l'InvertedIndex
            const invertedEntry =
              await this.prismaService.invertedIndex.findUnique({
                where: { mot: word },
              });
            console.log(invertedEntry);

            if (invertedEntry) {
              occurrences = JSON.parse(invertedEntry.occurrences as string);
              console.log('Occurence obtenu : ', occurrences);
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
        } else {
          console.log(
            'Contenu URL n"est pas disponiblee pour le livre ${livre.id}',
          );
        }
      } catch (error) {
        console.error(
          'Contenu URL a échéoue de fetch le contenu avec pour id ${livre_id}',
        );
      }

      // Créez ou mettez à jour l'entrée de l'InvertedIndex pour chaque mot
    }
  }
}
