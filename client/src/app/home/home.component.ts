import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SearchbarComponent } from '../searchbar/searchbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, SearchbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
