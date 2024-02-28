import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Book } from '../models/book.model';
// import { BookService } from '../services/book.service';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatGridListModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  @Input() books: Book[] = [];

  //constructor(private bookService: BookService) {}

  ngOnInit(): void {
    //this.getBooks();
  }

  // getBooks(): void {
  //   this.bookService.getBooks().subscribe((books) => {
  //     this.books = books;
  //   });
  // }
}
