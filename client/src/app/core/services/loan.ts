import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Loan, LoanRequest } from '../models/loan.model';

@Injectable({ providedIn: 'root' })
export class LoanService {
  constructor(private api: ApiService) {}

  getAll(params: Record<string, string> = {}) {
    return this.api.get<{ loans: Loan[]; total: number }>('/loans', params);
  }

  getOne(id: string) {
    return this.api.get<{ loan: Loan }>(`/loans/${id}`);
  }

  create(data: LoanRequest) {
    return this.api.post<{ loan: Loan }>('/loans', data);
  }

  return(id: string) {
    return this.api.patch<{ loan: Loan }>(`/loans/${id}/return`);
  }
}