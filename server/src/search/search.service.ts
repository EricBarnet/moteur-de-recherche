import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchBooks(keyword: string): Promise<any[]> {
    // Trouver les occurrences du mot-clé dans l'index inversé
    const occurrences = await this.prisma.invertedIndex.findMany({
      where: {
        mot: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
    });

    // Extraire les IDs des livres à partir des occurrences
    const bookIds = occurrences.flatMap((occ) => {
      // Assurez-vous que occ.occurrences est une chaîne avant de la parser
      if (typeof occ.occurrences === 'string') {
        return JSON.parse(occ.occurrences).map((occ: any) => occ.livreId);
      }
      // Si ce n'est pas une chaîne, retournez un tableau vide
      return [];
    });

    // Récupérer les détails des livres correspondants
    const books = await this.prisma.livre.findMany({
      where: {
        id: { in: bookIds },
      },
    });

    return books.map((book) => ({
      titre: book.titre,
      auteur: book.auteur,
      contenuUrl: book.contenuUrl,
      // Ajoutez d'autres propriétés nécessaires
    }));
  }
}
