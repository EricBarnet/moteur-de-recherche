import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapingModule } from './scraping/scraping.module';
import { PrismaService } from './prisma/prisma.service';
import { SearchService } from './search/search.service';
import { SearchController } from './search/search.controller';

@Module({
  imports: [ScrapingModule],
  controllers: [AppController, SearchController],
  providers: [AppService, PrismaService, SearchService],
})
export class AppModule {}
