import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Message } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class MessageService {
  constructor(private api: ApiService) {}

  create(data: any) {
    return this.api.post<{ message: Message }>('/messages', data);
  }

  getAll(params: Record<string, string> = {}) {
    return this.api.get<{ messages: Message[]; total: number }>('/messages', params);
  }

  reply(id: string, replyText: string) {
    return this.api.patch<{ message: Message }>(`/messages/${id}/reply`, { replyText });
  }
}