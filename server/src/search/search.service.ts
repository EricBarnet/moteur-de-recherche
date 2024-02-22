import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SearchService {
  constructor(private httpService: HttpService) {}

  async explicitSearch(keyword: string): Promise<any> {
    const searchUrl = `https://gutendex.com/books?search=${keyword}`;
    const response$ = this.httpService.get(searchUrl);
    const response = await lastValueFrom(response$);

    if (response.status === 200 && response.data.results.length > 0) {
      return response.data.results.map((book) => ({
        title: book.title,
        author: book.authors.map((author) => author.name).join(', '),
        textUrl:
          book.formats['text/plain'] ||
          book.formats['text/html'] ||
          'URL non disponible',
      }));
    } else {
      throw new Error(`Failed to search books with keyword: ${keyword}`);
    }
  }
}
