export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  genre?: string;
  year?: number;
  description?: string;
  bookLanguage?: string;
  pages?: number;
  coverUrl?: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
}

export interface BookRequest {
  title: string;
  author: string;
  isbn: string;
  genre?: string;
  year?: number;
  description?: string;
  bookLanguage?: string;
  pages?: number;
  coverUrl?: string;
  totalCopies: number;
  availableCopies: number;
}