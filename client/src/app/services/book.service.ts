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
    {
      id: 3,
      title: 'Livre Trois',
      author: 'Auteur Trois',
      description: 'Description du Livre Trois',
    },
    {
      id: 4,
      title: 'Livre Quatre',
      author: 'Auteur Quatre',
      description: 'Description du Livre Quatre',
    },
  ];

  constructor() {}

  // Récupérer les livres
  public getBooks(): Observable<Book[]> {
    return of(this.mockBooks);
  }
}
