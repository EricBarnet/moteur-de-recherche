import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapingModule } from './scraping/scraping.module';
import { PrismaService } from './prisma/prisma.service';
import { SearchService } from './search/search.service';
import { SearchController } from './search/search.controller';
import { IndexingService } from './indexing/indexing.service';
import { IndexingController } from './indexing/indexing.controller';

@Module({
  imports: [HttpModule, ScrapingModule],
  controllers: [AppController, SearchController, IndexingController],
  providers: [AppService, PrismaService, SearchService, IndexingService],
})
export class AppModule {}
