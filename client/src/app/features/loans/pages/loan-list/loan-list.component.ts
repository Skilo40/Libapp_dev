import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { LoanService } from '../../../../core/services/loan';
import { Loan } from '../../../../core/models/loan.model';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [
    CommonModule, NgFor, NgIf, RouterLink, FormsModule,
    MatIconModule, MatButtonModule, MatInputModule,
    MatFormFieldModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatSelectModule,
  ],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.scss'
})
export class LoanListComponent implements OnInit {
  loans: Loan[] = [];
  loading = true;
  statusFilter = '';

  constructor(
    private loanService: LoanService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: Record<string, string> = {};
    if (this.statusFilter) params['status'] = this.statusFilter;

    this.loanService.getAll(params).subscribe({
      next: (res) => { this.loans = res.loans; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  returnBook(loan: Loan) {
    if (!confirm(`Підтвердити повернення книги "${loan.book.title}"?`)) return;
    this.loanService.return(loan._id).subscribe({
      next: () => {
        this.snackBar.open('Книгу повернено', 'OK', { duration: 3000, panelClass: 'success' });
        this.load();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Помилка', 'OK', { duration: 3000, panelClass: 'error' }),
    });
  }

  extendLoan(loan: Loan) {
    const days = prompt('Введіть кількість днів для продовження:', '14');
    if (!days || isNaN(Number(days))) return;

    this.loanService.extend(loan._id, Number(days)).subscribe({
      next: () => {
        this.snackBar.open('Позику продовжено', 'OK', { duration: 3000, panelClass: 'success' });
        this.load();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Помилка', 'OK', { duration: 3000, panelClass: 'error' }),
    });
  }

  isOverdue(loan: Loan): boolean {
    return loan.status === 'active' && new Date(loan.dueDate) < new Date();
  }

  getDaysLeft(loan: Loan): number {
    const diff = new Date(loan.dueDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getStatusLabel(loan: Loan): string {
    if (loan.status === 'returned') return 'Повернено';
    if (loan.status === 'overdue') return 'Прострочено';
    const days = this.getDaysLeft(loan);
    if (days < 0) return 'Прострочено';
    if (days <= 3) return `Залишилось ${days} дн.`;
    return 'Активна';
  }

  getStatusClass(loan: Loan): string {
    if (loan.status === 'returned') return 'returned';
    if (loan.status === 'overdue' || this.isOverdue(loan)) return 'overdue';
    if (this.getDaysLeft(loan) <= 3) return 'warning';
    return 'active';
  }
}