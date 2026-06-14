import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from './api';
import { Booking } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private api: ApiService) {}

  create(data: any) {
    return this.api.post<{ booking: Booking }>('/bookings', data);
  }

  getAll(params: Record<string, string> = {}) {
    return this.api.get<{ bookings: Booking[]; total: number }>('/bookings', params);
  }

  update(id: string, data: any) {
    return this.api.patch<{ booking: Booking }>(`/bookings/${id}`, data);
  }

  updatePickupDate(id: string, pickupDeadline: string) {
    return this.api.patch<{ booking: Booking }>(`/bookings/${id}/pickup-date`, { pickupDeadline });
  }

  getMemberBookings(memberId: string) {
    return this.api.get<{ bookings: Booking[] }>(`/bookings/member/${memberId}`);
  }

  // Перевірити чи користувач вже забронював цю книгу
  hasActiveBooking(memberId: string, bookId: string) {
    return this.api.get<{ bookings: Booking[] }>(`/bookings/member/${memberId}`).pipe(
      map(res => res.bookings.some(b => 
        b.book._id === bookId && (b.status === 'pending' || b.status === 'approved')
      ))
    );
  }
}