import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('keyword') keyword: string) {
    // Assurez-vous que keyword est une chaîne non vide
    if (!keyword) {
      return { message: 'Le mot-clé de recherche est requis.' };
    }
    return this.searchService.searchBooks(keyword);
  }
}
