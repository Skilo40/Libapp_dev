import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { AuditLog } from '../models/audit-log.model';
import { Loan } from '../models/loan.model';
import { Book } from '../models/book.model';

export interface Stats {
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
  overdueLoans: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private api: ApiService) {}

  getStats() {
    return this.api.get<Stats>('/admin/stats');
  }

  getAuditLogs(params: Record<string, string> = {}) {
    return this.api.get<{ logs: AuditLog[]; total: number; pages: number }>('/admin/audit', params);
  }

  updateLoan(id: string, data: any) {
    return this.api.patch<{ loan: Loan }>(`/admin/loans/${id}`, data);
  }

  updateStock(id: string, data: { quantity: number; reason?: string }) {
    return this.api.patch<{ book: Book }>(`/admin/books/${id}/stock`, data);
  }

  addStockLot(data: any) {
    return this.api.post<{ book: Book }>('/admin/stock/lot', data);
  }
}