import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('explicit')
  async explicitSearch(@Query('keyword') keyword: string) {
    return this.searchService.explicitSearch(keyword);
  }
}
