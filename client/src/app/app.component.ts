import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PeriodicTableComponent} from "./periodic-table/periodic-table.component";
import {SearchBarComponent} from "./search-bar/search-bar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PeriodicTableComponent, SearchBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';

  onSearch(query: string): void {
    console.log('Search query:', query);
  }
}
