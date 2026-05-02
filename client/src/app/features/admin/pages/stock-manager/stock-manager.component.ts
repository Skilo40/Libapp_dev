import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminService } from '../../../../core/services/admin';
import { BookService } from '../../../../core/services/book';
import { Book } from '../../../../core/models/book.model';

@Component({
  selector: 'app-stock-manager',
  standalone: true,
  imports: [
    CommonModule, NgIf, NgFor, ReactiveFormsModule, RouterLink,
    MatInputModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule,
    MatSelectModule, MatTabsModule,
  ],
  templateUrl: './stock-manager.component.html',
  styleUrl: './stock-manager.component.scss'
})
export class StockManagerComponent implements OnInit {
  lotForm: FormGroup;
  adjustForm: FormGroup;
  books: Book[] = [];
  saving = false;
  adjusting = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private bookService: BookService,
    private snackBar: MatSnackBar,
  ) {
    this.lotForm = this.fb.group({
      isbn: ['', Validators.required],
      title: [''],
      author: [''],
      genre: [''],
      year: [null],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });

    this.adjustForm = this.fb.group({
      bookId: ['', Validators.required],
      quantity: [0, Validators.required],
      reason: [''],
    });
  }

  ngOnInit() {
    this.bookService.getAll().subscribe(res => this.books = res.books);
  }

  submitLot() {
    if (this.lotForm.invalid) return;
    this.saving = true;
    this.adminService.addStockLot(this.lotForm.value).subscribe({
      next: (res) => {
        this.saving = false;
        this.snackBar.open('Лот додано успішно', 'OK', { duration: 3000, panelClass: 'success' });
        this.lotForm.reset({ quantity: 1 });
        this.bookService.getAll().subscribe(r => this.books = r.books);
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err.error?.message || 'Помилка', 'OK', { duration: 3000, panelClass: 'error' });
      },
    });
  }

  submitAdjust() {
    if (this.adjustForm.invalid) return;
    this.adjusting = true;
    const { bookId, quantity, reason } = this.adjustForm.value;
    this.adminService.updateStock(bookId, { quantity, reason }).subscribe({
      next: () => {
        this.adjusting = false;
        this.snackBar.open('Запаси оновлено', 'OK', { duration: 3000, panelClass: 'success' });
        this.adjustForm.reset();
        this.bookService.getAll().subscribe(r => this.books = r.books);
      },
      error: (err) => {
        this.adjusting = false;
        this.snackBar.open(err.error?.message || 'Помилка', 'OK', { duration: 3000, panelClass: 'error' });
      },
    });
  }
}