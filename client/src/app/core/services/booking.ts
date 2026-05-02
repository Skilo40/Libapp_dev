import { Injectable } from '@angular/core';
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

  getMemberBookings(memberId: string) {
    return this.api.get<{ bookings: Booking[] }>(`/bookings/member/${memberId}`);
  }
}