import { Component, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  isSearchPerformed = false;

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe((books) => {
      this.books = books;
    });
  }

  // onSearch(searchValue: string): void {
  //   BookService.getBooks().subscribe((books) => {
  //     this.filteredBooks = books.filter((book) =>
  //       book.description.toLowerCase().includes(searchValue.toLowerCase())
  //     );
  //     this.isSearchPerformed = true;
  //   });
  // }
  onSearch(searchTerm: string) {
    this.isSearchPerformed = true;
    searchTerm = searchTerm.toLowerCase();

    this.filteredBooks = this.books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
