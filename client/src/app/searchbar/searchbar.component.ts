import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {
  isSearchPerformed = false;
  @Output() search = new EventEmitter<string>(); // Emitting event search
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  // Méthode de recherche
  onSearch(value: string, event: Event) {
    event.preventDefault(); 
    this.search.emit(value); // Emit la valeur de la recherche
  }
}
