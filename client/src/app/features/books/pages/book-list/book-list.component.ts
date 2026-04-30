import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { BookService } from '../../../../core/services/book';
import { Book } from '../../../../core/models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatIconModule, MatButtonModule, MatInputModule,
    MatFormFieldModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatDialogModule, MatChipsModule,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  loading = true;
  search = '';
  filterAvailable = false;

  constructor(
    private bookService: BookService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: Record<string, string> = {};
    if (this.search) params['search'] = this.search;
    if (this.filterAvailable) params['available'] = 'true';

    this.bookService.getAll(params).subscribe({
      next: (res) => { this.books = res.books; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch() { this.load(); }

  clearSearch() { this.search = ''; this.load(); }

  toggleAvailable() { this.filterAvailable = !this.filterAvailable; this.load(); }

  delete(book: Book) {
    if (!confirm(`Видалити книгу "${book.title}"?`)) return;
    this.bookService.delete(book._id).subscribe({
      next: () => {
        this.snackBar.open('Книгу видалено', 'OK', { duration: 3000, panelClass: 'success' });
        this.load();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Помилка', 'OK', { duration: 3000, panelClass: 'error' }),
    });
  }
}