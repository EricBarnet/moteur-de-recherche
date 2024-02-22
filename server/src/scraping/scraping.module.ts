import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { ScrapingController } from './scraping.controller';
@Module({
  imports: [HttpModule],
  providers: [PrismaService, ScrapingService],
  controllers: [ScrapingController],
})
export class ScrapingModule {}
