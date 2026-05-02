import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Member } from '../models/member.model';
import { Loan } from '../models/loan.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private api: ApiService) {}

  get(id: string) {
    return this.api.get<{ member: Member }>(`/profile/${id}`);
  }

  update(id: string, data: any) {
    return this.api.patch<{ member: Member }>(`/profile/${id}`, data);
  }

  getLoanHistory(id: string) {
    return this.api.get<{ loans: Loan[] }>(`/profile/${id}/loans`);
  }
}