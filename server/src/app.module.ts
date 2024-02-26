import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { BooksService } from './books/books.service';
import { BooksController } from './books/books.controller';
@Module({
  imports: [HttpModule],
  controllers: [AppController, BooksController],
  providers: [AppService, PrismaService, BooksService],
})
export class AppModule {}
