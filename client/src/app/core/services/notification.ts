import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Notification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private api: ApiService) {}

  getAll(memberId: string) {
    return this.api.get<{ notifications: Notification[]; unread: number }>(`/notifications/${memberId}`);
  }

  markRead(memberId: string) {
    return this.api.patch<{ message: string }>(`/notifications/${memberId}/read`);
  }
}