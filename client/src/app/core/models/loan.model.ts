import { Book } from './book.model';
import { Member } from './member.model';
import { User } from './user.model';

export interface Loan {
  _id: string;
  book: Book;
  member: Member;
  issuedBy: User;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  notes?: string;
  createdAt: string;
}

export interface LoanRequest {
  bookId: string;
  memberId: string;
  dueDate: string;
  notes?: string;
}