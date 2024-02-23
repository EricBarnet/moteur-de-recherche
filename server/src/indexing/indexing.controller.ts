// indexing.controller.ts
import { Controller, Get } from '@nestjs/common';
import { IndexingService } from './indexing.service';

@Controller('indexing')
export class IndexingController {
  constructor(private indexingService: IndexingService) {}

  @Get('/populate')
  populateInvertedIndex() {
    return this.indexingService.populateInvertedIndex();
  }
}
