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
import { CatalogService } from '../../../../core/services/catalog';
import { BookingService } from '../../../../core/services/booking';
import { AuthService } from '../../../../core/services/auth';
import { StateService } from '../../../../core/services/state';
import { Book } from '../../../../core/models/book.model';
import { Review } from '../../../../core/models/review.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    CommonModule, NgFor, NgIf, RouterLink,
    ReactiveFormsModule, MatIconModule, MatButtonModule,
    MatInputModule, MatFormFieldModule,
    MatProgressSpinnerModule, MatSnackBarModule,
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
  userHasActiveBooking = false;

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
    private state: StateService,
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
        this.prefillBookingForm();
        this.checkActiveBooking();
      },
      error: () => { this.loading = false; }
    });
  }

  prefillBookingForm() {
    const user = this.state.currentUser();
    if (!user) return;

    const nameParts = user.name?.trim().split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    this.bookingForm.patchValue({
      firstName,
      lastName,
      email: user.email || '',
    });
  }

  checkActiveBooking() {
    const user = this.state.currentUser();
    if (!user || !this.book || user.role !== 'member') {
      this.userHasActiveBooking = false;
      return;
    }

    this.bookingService.getMemberBookings(user._id).subscribe({
      next: (res) => {
        this.userHasActiveBooking = res.bookings.some(b => 
          (b.book as any)._id === this.book!._id && (b.status === 'pending' || b.status === 'approved')
        );
      },
      error: () => {
        this.userHasActiveBooking = false;
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUser() {
    return this.state.currentUser();
  }

  onBookingClick() {
    if (!this.book) return;
    
    const user = this.state.currentUser();
    if (this.isLoggedIn && user?.role === 'member' && this.userHasActiveBooking) {
      this.snackBar.open('Ви вже маєте активне бронювання для цієї книги', 'OK', {
        duration: 3000, panelClass: 'error'
      });
      return;
    }
    
    if (this.isLoggedIn) {
      this.quickBooking();
    } else {
      this.showBookingForm = !this.showBookingForm;
    }
  }

  onReviewClick() {
    if (!this.isLoggedIn) {
      this.snackBar.open('Увійдіть щоб залишити відгук', 'Увійти', {
        duration: 5000,
      }).onAction().subscribe(() => {
        window.location.href = '/login';
      });
    } else {
      this.showReviewForm = !this.showReviewForm;

      const user = this.state.currentUser();
      if (user && this.showReviewForm) {
        this.reviewForm.patchValue({ authorName: user.name });
      }
    }
  }

  quickBooking() {
    if (!this.book) return;
    this.savingBooking = true;

    const user = this.state.currentUser();
    const nameParts = user?.name?.trim().split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    this.bookingService.create({
      firstName,
      lastName,
      email: user?.email || '',
      notes: '',
      bookId: this.book._id,
      memberId: user?.role === 'member' ? user._id : undefined,
    }).subscribe({
      next: () => {
        this.savingBooking = false;
        this.snackBar.open('Книгу успішно забронійовано!', 'OK', {
          duration: 4000, panelClass: 'success'
        });
      },
      error: (err) => {
        this.savingBooking = false;
        this.snackBar.open(err.error?.message || 'Помилка при бронюванні', 'OK', {
          duration: 3000, panelClass: 'error'
        });
      },
    });
  }

  submitBooking() {
    if (this.bookingForm.invalid) return;
    this.savingBooking = true;

    const user = this.state.currentUser();

    this.bookingService.create({
      ...this.bookingForm.value,
      bookId: this.book!._id,
      memberId: user?.role === 'member' ? user._id : undefined,
    }).subscribe({
      next: () => {
        this.savingBooking = false;
        this.showBookingForm = false;
        this.bookingForm.reset();
        this.snackBar.open('Заявку на бронювання подано!', 'OK', {
          duration: 4000, panelClass: 'success'
        });
      },
      error: (err) => {
        this.savingBooking = false;
        this.snackBar.open(err.error?.message || 'Помилка', 'OK', {
          duration: 3000, panelClass: 'error'
        });
      },
    });
  }

  submitReview() {
    if (this.reviewForm.invalid || this.selectedRating === 0) return;
    this.savingReview = true;

    const user = this.state.currentUser();

    this.catalogService.createReview(this.book!._id, {
      ...this.reviewForm.value,
      rating: this.selectedRating,
      memberId: user?.role === 'member' ? user._id : undefined,
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