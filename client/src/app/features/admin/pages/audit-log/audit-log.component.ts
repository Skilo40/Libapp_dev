import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../../../core/services/admin';
import { AuditLog } from '../../../../core/models/audit-log.model';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [
    CommonModule, NgIf, NgFor, FormsModule, RouterLink, DatePipe,
    MatIconModule, MatButtonModule, MatInputModule,
    MatFormFieldModule, MatSelectModule,
    MatProgressSpinnerModule, MatSnackBarModule,
  ],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.scss'
})
export class AuditLogComponent implements OnInit {
  logs: AuditLog[] = [];
  loading = true;
  total = 0;
  pages = 1;
  currentPage = 1;

  entityTypeFilter = '';
  actionFilter = '';

  entityTypes = [
    { id: 'book', name: 'Книги' },
    { id: 'member', name: 'Читачі' },
    { id: 'loan', name: 'Позики' },
    { id: 'stock', name: 'Запаси' },
    { id: 'user', name: 'Персонал' }
  ];

  actions = [
    { id: 'BOOK_CREATED', name: 'Створення книги' },
    { id: 'BOOK_UPDATED', name: 'Оновлення книги' },
    { id: 'BOOK_DELETED', name: 'Видалення книги' },
    { id: 'MEMBER_CREATED', name: 'Реєстрація читача' },
    { id: 'MEMBER_UPDATED', name: 'Оновлення читача' },
    { id: 'MEMBER_DELETED', name: 'Видалення читача' },
    { id: 'LOAN_CREATED', name: 'Видача книги' },
    { id: 'LOAN_RETURNED', name: 'Повернення книги' },
    { id: 'LOAN_UPDATED', name: 'Оновлення позики' },
    { id: 'STOCK_UPDATED', name: 'Зміна запасів' },
    { id: 'LOGIN', name: 'Вхід в систему' },
    { id: 'USER_CREATED', name: 'Створення працівника' },
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: Record<string, string> = {
      page: String(this.currentPage),
      limit: '15',
    };
    if (this.entityTypeFilter) params['entityType'] = this.entityTypeFilter;
    if (this.actionFilter) params['action'] = this.actionFilter;

    this.adminService.getAuditLogs(params).subscribe({
      next: (res) => {
        this.logs = res.logs;
        this.total = res.total;
        this.pages = res.pages;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.load();
  }

  resetFilters() {
    this.entityTypeFilter = '';
    this.actionFilter = '';
    this.currentPage = 1;
    this.load();
  }

  getActionBadgeLabel(action: string): string {
    const found = this.actions.find(a => a.id === action);
    return found ? found.name : action;
  }

  getActionMessage(log: AuditLog): string {
    switch (log.action) {
      case 'BOOK_CREATED': return 'Додано нову книгу до каталогу';
      case 'BOOK_UPDATED': return 'Оновлено інформацію про книгу';
      case 'BOOK_DELETED': return 'Книгу видалено з каталогу';
      case 'MEMBER_CREATED': return 'Зареєстровано нового читача';
      case 'MEMBER_UPDATED': return 'Оновлено профіль читача';
      case 'MEMBER_DELETED': return 'Профіль читача видалено';
      case 'LOAN_CREATED': return 'Оформлено нову позику (видано книгу)';
      case 'LOAN_RETURNED': return 'Читач повернув книгу в бібліотеку';
      case 'LOAN_UPDATED': return 'Оновлено статус позики';
      case 'STOCK_UPDATED': return 'Змінено кількість примірників';
      case 'LOGIN': return 'Успішний вхід в систему';
      case 'USER_CREATED': return 'Створено обліковий запис працівника';
      default: return 'Виконано системну дію';
    }
  }

  getActionColor(action: string): string {
    if (action.includes('CREATED')) return 'green';
    if (action.includes('DELETED')) return 'red';
    if (action.includes('UPDATED') || action.includes('RETURNED')) return 'blue';
    if (action === 'LOGIN') return 'purple';
    return 'gray';
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.pages }, (_, i) => i + 1);
  }
}