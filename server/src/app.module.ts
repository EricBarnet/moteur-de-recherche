import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapingModule } from './scraping/scraping.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ScrapingModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
