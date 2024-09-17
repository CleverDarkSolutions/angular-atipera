import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: 'search-bar.component.scss'

})
export class SearchBarComponent {
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(2000)
    ).subscribe(searchText => {
      this.search.emit(searchText);
    });
  }

  onSearch(value: string): void {
    this.searchSubject.next(value);
  }
}
