import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchBooks(query: string): Observable<Book[]> {
    const url = `${this.apiUrl}/books/search`;
    const params = new HttpParams().set('q', query);
    return this.http.get<Book[]>(url, { params }).pipe(
      tap((data) => console.log('Search results:', data)),
      catchError((error) => {
        console.error('Search error:', error);
        return throwError(() => error);
      })
    );
  }
}
