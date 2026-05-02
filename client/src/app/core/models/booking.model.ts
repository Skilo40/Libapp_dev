import { Book } from './book.model';
import { Member } from './member.model';

export interface Booking {
  _id: string;
  book: Book;
  member?: Member;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  pickupDeadline?: string;
  notes?: string;
  adminNote?: string;
  createdAt: string;
}