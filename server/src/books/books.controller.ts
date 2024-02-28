import { Controller, Get, Query, Post, Param, Body } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Endpoint pour rechercher des mots dans les livres
  @Get('search')
  async searchBooks(@Query('q') query: string) {
    const results = await this.booksService.searchBooks(query);
    return results; // Cela retournera un tableau des livres contenant les mots recherchés
  }

  @Post(':bookId')
  async addBook(@Param('bookId') bookId: number) {
    await this.booksService.addBook(bookId);
    return { message: 'Book added successfully' };
  }

  @Post()
  async addBooks(@Body() bookIds: number[]) {
    console.time('ajout de tout les livres dureee total');
    for (const bookId of bookIds) {
      await this.booksService.addBook(bookId);
    }
    console.timeEnd('ajout de tout les livres dureee total');
    return { message: `${bookIds.length} books added successfully` };
  }
}
