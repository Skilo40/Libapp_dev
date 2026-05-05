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
import { Member } from '../../../../core/models/member.model';
import { Loan } from '../../../../core/models/loan.model';
import { Notification } from '../../../../core/models/notification.model';
import { FooterComponent } from '../../../../shared/components/footer/footer';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, NgFor, NgIf, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatInputModule,
    MatFormFieldModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatTabsModule,
    FooterComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  member: Member | null = null;
  loans: Loan[] = [];
  notifications: Notification[] = [];
  unread = 0;
  loading = true;
  saving = false;
  editMode = false;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      address: [''],
      avatarUrl: [''],
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
  }

  saveProfile() {
    if (this.form.invalid) return;
    this.saving = true;

    this.profileService.update(this.member!._id, this.form.value).subscribe({
      next: (res) => {
        this.member = res.member;
        this.saving = false;
        this.editMode = false;
        this.snackBar.open('Профіль оновлено', 'OK', { duration: 3000, panelClass: 'success' });
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Помилка збереження', 'OK', { duration: 3000, panelClass: 'error' });
      },
    });
  }

  markAllRead() {
    this.notificationService.markRead(this.member!._id).subscribe(() => {
      this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
      this.unread = 0;
    });
  }

  deleteNotification(notificationId: string) {
    this.notificationService.delete(notificationId).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n._id === notificationId);
        if (notification && !notification.isRead) {
          this.unread--;
        }
        this.notifications = this.notifications.filter(n => n._id !== notificationId);
        this.snackBar.open('Сповіщення видалено', 'OK', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Помилка видалення', 'OK', { duration: 3000, panelClass: 'error' });
      }
    });
  }

  getLoanStatus(loan: Loan): { label: string; class: string } {
    if (loan.status === 'returned') return { label: 'Повернено', class: 'returned' };
    const daysLeft = Math.ceil((new Date(loan.dueDate).getTime() - Date.now()) / 86400000);
    if (daysLeft < 0) return { label: 'Прострочено', class: 'overdue' };
    if (daysLeft <= 3) return { label: `Повернути за ${daysLeft} дн.`, class: 'warning' };
    return { label: 'Активна', class: 'active' };
  }
}