import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { BookService } from '../../../../core/services/book';

const GENRES = ['Художня', 'Наукова', 'Фантастика', 'Детектив', 'Поезія',
  'Біографія', 'Історична', 'Дитяча', 'Навчальна', 'Інше'];

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatInputModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatSelectModule,
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss'
})
export class BookFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  saving = false;
  isEdit = false;
  bookId: string | null = null;
  genres = GENRES;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      isbn: ['', [Validators.required]],
      genre: [''],
      year: [null],
      description: [''],
      totalCopies: [1, [Validators.required, Validators.min(1)]],
      availableCopies: [1, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookId) {
      this.isEdit = true;
      this.loading = true;
      this.bookService.getOne(this.bookId).subscribe({
        next: (res) => { this.form.patchValue(res.book); this.loading = false; },
        error: () => { this.loading = false; this.router.navigate(['/books']); }
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;

    const action = this.isEdit
      ? this.bookService.update(this.bookId!, this.form.value)
      : this.bookService.create(this.form.value);

    action.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Книгу оновлено' : 'Книгу додано',
          'OK', { duration: 3000, panelClass: 'success' }
        );
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err.error?.message || 'Помилка', 'OK', { duration: 3000, panelClass: 'error' });
      },
    });
  }
}