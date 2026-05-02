import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
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
    CommonModule, NgIf, NgFor, FormsModule, RouterLink,
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

  entityTypes = ['book', 'member', 'loan', 'stock', 'user'];
  actions = [
    'BOOK_CREATED', 'BOOK_UPDATED', 'BOOK_DELETED',
    'MEMBER_CREATED', 'MEMBER_UPDATED', 'MEMBER_DELETED',
    'LOAN_CREATED', 'LOAN_RETURNED', 'LOAN_UPDATED',
    'STOCK_UPDATED', 'LOGIN', 'USER_CREATED',
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