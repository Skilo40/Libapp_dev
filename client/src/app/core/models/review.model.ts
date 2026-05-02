import { Member } from './member.model';

export interface Review {
  _id: string;
  book: string;
  member?: Member;
  authorName: string;
  text: string;
  rating: number;
  createdAt: string;
}