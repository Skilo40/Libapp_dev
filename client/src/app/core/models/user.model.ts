export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'librarian';
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}