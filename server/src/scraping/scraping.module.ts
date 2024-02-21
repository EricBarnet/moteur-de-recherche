import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  providers: [PrismaService, ScrapingService],
})
export class ScrapingModule {}
