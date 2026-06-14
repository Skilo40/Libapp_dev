import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ProfileService } from '../../../../core/services/profile';
import { NotificationService } from '../../../../core/services/notification';
import { BookingService } from '../../../../core/services/booking';
import { StateService } from '../../../../core/services/state';
import { Member } from '../../../../core/models/member.model';
import { Loan } from '../../../../core/models/loan.model';
import { Notification } from '../../../../core/models/notification.model';
import { Booking } from '../../../../core/models/booking.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, NgFor, NgIf, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatInputModule,
    MatFormFieldModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatTabsModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  member: Member | null = null;
  loans: Loan[] = [];
  notifications: Notification[] = [];
  bookings: Booking[] = [];
  unread = 0;
  loading = true;
  saving = false;
  editMode = false;
  form: FormGroup;
  selectedAvatar: File | null = null;
  avatarPreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private bookingService: BookingService,
    public state: StateService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      address: [''],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.profileService.get(id).subscribe({
      next: (res) => {
        this.member = res.member;
        this.form.patchValue(res.member);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    this.profileService.getLoanHistory(id).subscribe(res => {
      this.loans = res.loans;
    });

    this.notificationService.getAll(id).subscribe(res => {
      this.notifications = res.notifications;
      this.unread = res.unread;
    });

    this.bookingService.getMemberBookings(id).subscribe(res => {
      this.bookings = res.bookings;
    });
  }

  saveProfile() {
    if (this.form.invalid) return;
    this.saving = true;

    const formData = new FormData();
    formData.append('firstName', this.form.get('firstName')?.value);
    formData.append('lastName', this.form.get('lastName')?.value);
    formData.append('phone', this.form.get('phone')?.value || '');
    formData.append('address', this.form.get('address')?.value || '');
    if (this.selectedAvatar) {
      formData.append('avatar', this.selectedAvatar);
    }

    this.profileService.updateWithFile(this.member!._id, formData).subscribe({
      next: (res) => {
        this.member = res.member;
        this.saving = false;
        this.editMode = false;
        this.selectedAvatar = null;
        this.avatarPreview = null;
        this.snackBar.open('Профіль оновлено', 'OK', { duration: 3000, panelClass: 'success' });
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Помилка збереження', 'OK', { duration: 3000, panelClass: 'error' });
      },
    });
  }

  onAvatarSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.selectedAvatar = file;

    // Показати превью
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.avatarPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  removeAvatar() {
    this.selectedAvatar = null;
    this.avatarPreview = null;
  }

  markAllRead() {
    this.notificationService.markRead(this.member!._id).subscribe(() => {
      this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
      this.unread = 0;
    });
  }

  getLoanStatus(loan: Loan): { label: string; class: string } {
    if (loan.status === 'returned') return { label: 'Повернено', class: 'returned' };
    const daysLeft = Math.ceil((new Date(loan.dueDate).getTime() - Date.now()) / 86400000);
    if (daysLeft < 0) return { label: 'Прострочено', class: 'overdue' };
    if (daysLeft <= 3) return { label: `Повернути за ${daysLeft} дн.`, class: 'warning' };
    return { label: 'Активна', class: 'active' };
  }

  getBookingStatus(booking: Booking): { label: string; class: string } {
    const map: Record<string, { label: string; class: string }> = {
      pending:   { label: 'Очікує розгляду', class: 'pending' },
      approved:  { label: 'Схвалено', class: 'approved' },
      picked_up: { label: 'Книгу забрано', class: 'picked_up' },
      rejected:  { label: 'Відхилено', class: 'rejected' },
      cancelled: { label: 'Скасовано', class: 'cancelled' },
    };
    return map[booking.status] || { label: booking.status, class: '' };
  }

  isCurrentUser(): boolean {
    return this.state.currentUser()?._id === this.member?._id ||
           this.state.currentUser()?.role === 'admin';
  }
}