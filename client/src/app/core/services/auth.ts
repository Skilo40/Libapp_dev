import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ApiService } from './api';
import { StateService } from './state';
import { User, AuthResponse, LoginRequest } from '../models/user.model';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private api: ApiService,
    private router: Router,
    private state: StateService,
  ) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.state.setUser(JSON.parse(user));
    }
  }

  login(data: LoginRequest) {
    return this.api.post<AuthResponse>('/auth/login', data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.state.setUser(res.user);
      })
    );
  }

  register(data: RegisterRequest) {
    return this.api.post<AuthResponse>('/auth/register/member', data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.state.setUser(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.state.clearAuth();
    this.router.navigate(['/catalog']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.state.currentUser()?.role === 'admin';
  }

  currentUser() {
    return this.state.currentUser();
  }
}