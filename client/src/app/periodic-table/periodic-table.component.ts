import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableModule
} from "@angular/material/table";
import {MatFormField, MatInput, MatInputModule, MatLabel} from "@angular/material/input";
import {MatButton, MatButtonModule, MatIconButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog, MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {debounceTime} from "rxjs";
import {CommonModule} from "@angular/common";
export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss'
})

export class PeriodicTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'edit'];
  dataSource = ELEMENT_DATA;
  filterControl = new FormControl('');

  filteredData = ELEMENT_DATA;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.filterControl.valueChanges.pipe(
      debounceTime(2000)
    ).subscribe(value => {
      this.applyFilter(value!);
    });
  }

  applyFilter(filterValue: string): void {
    this.filteredData = this.dataSource.filter(element =>
      element.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      element.symbol.toLowerCase().includes(filterValue.toLowerCase()) ||
      element.position.toString().includes(filterValue) ||
      element.weight.toString().includes(filterValue)
    );
  }

  openEditDialog(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditElementDialog, {
      width: '250px',
      data: { ...element }  // Pass a copy of the element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateElement(result);
      }
    });
  }

  updateElement(updatedElement: PeriodicElement): void {
    this.dataSource = this.dataSource.map(el =>
      el.position === updatedElement.position ? updatedElement : el
    );
    this.filteredData = [...this.dataSource];
  }
}

@Component({
  selector: 'edit-element-dialog',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    FormsModule,
    MatDialogContent,
    MatDialogTitle,
    MatInput,
    MatDialogActions,
    MatButton
  ],
  template: `
    <h1 mat-dialog-title>Edit Element</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput [(ngModel)]="data.name">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Weight</mat-label>
        <input matInput [(ngModel)]="data.weight" type="number">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Symbol</mat-label>
        <input matInput [(ngModel)]="data.symbol">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button (click)="onSave()">Save</button>
    </div>
  `
})
export class EditElementDialog {
  constructor(
    public dialogRef: MatDialogRef<EditElementDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodicElement
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }
}
