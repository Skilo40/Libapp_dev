import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Member, MemberRequest } from '../models/member.model';

@Injectable({ providedIn: 'root' })
export class MemberService {
  constructor(private api: ApiService) {}

  getAll(params: Record<string, string> = {}) {
    return this.api.get<{ members: Member[]; total: number }>('/members', params);
  }

  getOne(id: string) {
    return this.api.get<{ member: Member }>(`/members/${id}`);
  }

  create(data: MemberRequest) {
    return this.api.post<{ member: Member }>('/members', data);
  }

  update(id: string, data: Partial<MemberRequest>) {
    return this.api.put<{ member: Member }>(`/members/${id}`, data);
  }

  delete(id: string) {
    return this.api.delete<{ message: string }>(`/members/${id}`);
  }
}