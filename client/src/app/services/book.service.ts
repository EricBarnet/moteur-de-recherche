import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private mockBooks: Book[] = [
    {
      id: 1,
      title: 'Frankenstein; Or, The Modern Prometheus',
      author: 'Shelley, Mary Wollstonecraft',
      description: 'Description 1',
    },
    {
      id: 2,
      title: 'Pride and Prejudice',
      author: 'Austen, Jane',
      description: 'Description 2',
    },
    {
      id: 3,
      title: 'Romeo and Juliet',
      author: 'Shakespeare, William',
      description: 'Description 3',
    },
    {
      id: 4,
      title: 'A Room with a View',
      author: 'Forster, E. M. (Edward Morgan)',
      description: 'Description 4',
    },
  ];

  constructor() {}

  // Récupérer les livres
  public getBooks(): Observable<Book[]> {
    return of(this.mockBooks);
  }
}
