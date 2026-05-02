import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Book } from '../models/book.model';
import { Review } from '../models/review.model';

export interface CatalogResponse {
  books: Book[];
  total: number;
}

export interface BookDetailResponse {
  book: Book;
  reviews: Review[];
  avgRating: number;
  similar: Book[];
}

export interface FiltersResponse {
  genres: string[];
  languages: string[];
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  constructor(private api: ApiService) {}

  getBooks(params: Record<string, string> = {}) {
    return this.api.get<CatalogResponse>('/catalog', params);
  }

  getBook(id: string) {
    return this.api.get<BookDetailResponse>(`/catalog/${id}`);
  }

  getFilters() {
    return this.api.get<FiltersResponse>('/catalog/filters');
  }

  createReview(bookId: string, data: { authorName: string; text: string; rating: number; memberId?: string }) {
    return this.api.post<{ review: Review }>(`/catalog/${bookId}/reviews`, data);
  }
}