import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getAll(memberId: string): Observable<{ notifications: Notification[], unread: number }> {
    return this.http.get<{ notifications: Notification[], unread: number }>(`${this.apiUrl}/member/${memberId}`);
  }

  markRead(memberId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/member/${memberId}/read`, {});
  }

  delete(notificationId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${notificationId}`);
  }
}