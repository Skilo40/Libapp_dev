import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CatalogService } from '../../../../core/services/catalog';
import { BookingService } from '../../../../core/services/booking';
import { AuthService } from '../../../../core/services/auth';
import { Book } from '../../../../core/models/book.model';
import { Review } from '../../../../core/models/review.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    CommonModule, NgFor, NgIf, RouterLink,
    ReactiveFormsModule, MatIconModule, MatButtonModule,
    MatInputModule, MatFormFieldModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDialogModule,
  ],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss'
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  reviews: Review[] = [];
  similar: Book[] = [];
  avgRating = 0;
  loading = true;
  showBookingForm = false;
  showReviewForm = false;
  savingBooking = false;
  savingReview = false;

  bookingForm: FormGroup;
  reviewForm: FormGroup;

  stars = [1, 2, 3, 4, 5];
  selectedRating = 0;
  hoverRating = 0;

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogService,
    private bookingService: BookingService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.bookingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      notes: [''],
    });

    this.reviewForm = this.fb.group({
      authorName: ['', Validators.required],
      text: ['', Validators.required],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.catalogService.getBook(id).subscribe({
      next: (res) => {
        this.book = res.book;
        this.reviews = res.reviews;
        this.avgRating = res.avgRating;
        this.similar = res.similar;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUser() {
    return this.authService.currentUser();
  }

  onBookingClick() {
    if (!this.book) return;
    
    // Якщо залогінений - робити booking одразу
    if (this.isLoggedIn) {
      this.quickBooking();
    } else {
      // Якщо не залогінений - показати форму
      this.showBookingForm = !this.showBookingForm;
    }
  }

  quickBooking() {
    if (!this.book) return;
    this.savingBooking = true;

    const user = this.currentUser;
    let firstName = user?.firstName || '';
    let lastName = user?.lastName || '';

    // Якщо firstName/lastName не знайдені, розділити name поле
    if (!firstName && !lastName && user?.name) {
      const nameParts = user.name.trim().split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    this.bookingService.create({
      firstName,
      lastName,
      email: user?.email || '',
      phone: user?.phone || '',
      notes: '',
      bookId: this.book._id,
    }).subscribe({
      next: () => {
        this.savingBooking = false;
        this.snackBar.open('Книгу успішно забронировано!', 'OK', { duration: 4000, panelClass: 'success' });
      },
      error: (err) => {
        this.savingBooking = false;
        this.snackBar.open(err.error?.message || 'Помилка при бронюванні', 'OK', { duration: 3000, panelClass: 'error' });
      },
    });
  }

  submitBooking() {
    if (this.bookingForm.invalid) return;
    this.savingBooking = true;

    this.bookingService.create({
      ...this.bookingForm.value,
      bookId: this.book!._id,
    }).subscribe({
      next: () => {
        this.savingBooking = false;
        this.showBookingForm = false;
        this.bookingForm.reset();
        this.snackBar.open('Заявку на бронювання подано!', 'OK', { duration: 4000, panelClass: 'success' });
      },
      error: (err) => {
        this.savingBooking = false;
        this.snackBar.open(err.error?.message || 'Помилка', 'OK', { duration: 3000, panelClass: 'error' });
      },
    });
  }

  submitReview() {
    if (this.reviewForm.invalid || this.selectedRating === 0) return;
    this.savingReview = true;

    this.catalogService.createReview(this.book!._id, {
      ...this.reviewForm.value,
      rating: this.selectedRating,
    }).subscribe({
      next: (res) => {
        this.reviews.unshift(res.review);
        this.savingReview = false;
        this.showReviewForm = false;
        this.reviewForm.reset();
        this.selectedRating = 0;
        this.snackBar.open('Відгук додано', 'OK', { duration: 3000, panelClass: 'success' });
      },
      error: () => {
        this.savingReview = false;
        this.snackBar.open('Помилка', 'OK', { duration: 3000, panelClass: 'error' });
      },
    });
  }

  getStarsArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating) ? 1 : 0);
  }
}