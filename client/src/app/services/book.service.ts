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
      title: 'Livre Un',
      author: 'Auteur Un',
      description: 'Description du Livre Un',
    },
    {
      id: 2,
      title: 'Livre Deux',
      author: 'Auteur Deux',
      description: 'Description du Livre Deux',
    },
  ];

  constructor() {}

  // Récupérer les livres
  getBooks(): Observable<Book[]> {
    return of(this.mockBooks);
  }
}
