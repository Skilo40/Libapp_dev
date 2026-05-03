import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { BookingService } from '../../../../core/services/booking';
import { Booking } from '../../../../core/models/booking.model';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule, NgFor, NgIf, FormsModule, RouterLink,
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatSelectModule, MatInputModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDialogModule,
  ],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss'
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  statusFilter = 'pending';
  selectedBooking: Booking | null = null;
  adminNote = '';
  pickupDeadline = '';
  processing = false;

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: Record<string, string> = {};
    if (this.statusFilter) params['status'] = this.statusFilter;

    this.bookingService.getAll(params).subscribe({
      next: (res) => { this.bookings = res.bookings; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
  markPickedUp(booking: Booking) {
  if (!confirm(`Підтвердити що книгу "${booking.book.title}" забрано?`)) return;
  this.processing = true;
  this.bookingService.update(booking._id, { status: 'picked_up' }).subscribe({
    next: () => {
      this.processing = false;
      this.snackBar.open('Статус оновлено — книгу забрано', 'OK', { duration: 3000, panelClass: 'success' });
      this.load();
    },
    error: () => {
      this.processing = false;
      this.snackBar.open('Помилка', 'OK', { duration: 3000, panelClass: 'error' });
    },
  });
}
  approve(booking: Booking) {
    if (!this.pickupDeadline) {
      this.snackBar.open('Вкажіть дату для отримання книги', 'OK', { duration: 3000 });
      return;
    }
    this.processing = true;
    this.bookingService.update(booking._id, {
      status: 'approved',
      adminNote: this.adminNote,
      pickupDeadline: this.pickupDeadline,
    }).subscribe({
      next: () => {
        this.processing = false;
        this.selectedBooking = null;
        this.adminNote = '';
        this.pickupDeadline = '';
        this.snackBar.open('Бронювання схвалено', 'OK', { duration: 3000, panelClass: 'success' });
        this.load();
      },
      error: () => {
        this.processing = false;
        this.snackBar.open('Помилка', 'OK', { duration: 3000, panelClass: 'error' });
      },
    });
  }

  reject(booking: Booking) {
    this.processing = true;
    this.bookingService.update(booking._id, {
      status: 'rejected',
      adminNote: this.adminNote,
    }).subscribe({
      next: () => {
        this.processing = false;
        this.selectedBooking = null;
        this.adminNote = '';
        this.snackBar.open('Бронювання відхилено', 'OK', { duration: 3000 });
        this.load();
      },
      error: () => {
        this.processing = false;
        this.snackBar.open('Помилка', 'OK', { duration: 3000, panelClass: 'error' });
      },
    });
  }
}