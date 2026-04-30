import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Book, BookRequest } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  constructor(private api: ApiService) {}

  getAll(params: Record<string, string> = {}) {
    return this.api.get<{ books: Book[]; total: number }>('/books', params);
  }

  getOne(id: string) {
    return this.api.get<{ book: Book }>(`/books/${id}`);
  }

  create(data: BookRequest) {
    return this.api.post<{ book: Book }>('/books', data);
  }

  update(id: string, data: Partial<BookRequest>) {
    return this.api.put<{ book: Book }>(`/books/${id}`, data);
  }

  delete(id: string) {
    return this.api.delete<{ message: string }>(`/books/${id}`);
  }
}