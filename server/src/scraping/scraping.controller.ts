import { Controller, Get } from '@nestjs/common';
import { ScrapingService } from './scraping.service';

@Controller('scraping')
export class ScrapingController {
  constructor(private scrapingService: ScrapingService) {}

  @Get('/scrape-books')
  async scrapeBooks() {
    await this.scrapingService.scrapeBooks();
    return { message: 'Scrapping est correcte. ' };
  }
}
