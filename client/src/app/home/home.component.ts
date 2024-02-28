import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { ListComponent } from '../list/list.component';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, SearchbarComponent, ListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  filteredBooks: Book[] = [];
  isSearchPerformed = false;

  constructor(private bookService: BookService) {}

  onSearch(searchTerm: string): void {
    this.bookService.searchBooks(searchTerm).subscribe(
      (results) => {
        this.filteredBooks = results.reduce(
          (acc: Book[], val) => acc.concat(val),
          []
        );
        this.isSearchPerformed = true;
      },
      (error) => {
        console.error('Search error:', error);
      }
    );
  }
}
