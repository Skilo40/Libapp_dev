import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./features/catalog/pages/catalog/catalog.component').then(m => m.CatalogComponent),
  },
  {
    path: 'catalog/:id',
    loadComponent: () =>
      import('./features/catalog/pages/book-detail/book-detail.component').then(m => m.BookDetail),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'books',
        loadComponent: () =>
          import('./features/books/pages/book-list/book-list.component').then(m => m.BookListComponent),
      },
      {
        path: 'books/new',
        loadComponent: () =>
          import('./features/books/pages/book-form/book-form.component').then(m => m.BookFormComponent),
      },
      {
        path: 'books/:id/edit',
        loadComponent: () =>
          import('./features/books/pages/book-form/book-form.component').then(m => m.BookFormComponent),
      },
      {
        path: 'members',
        loadComponent: () =>
          import('./features/members/pages/member-list/member-list.component').then(m => m.MemberListComponent),
      },
      {
        path: 'members/new',
        loadComponent: () =>
          import('./features/members/pages/member-form/member-form.component').then(m => m.MemberFormComponent),
      },
      {
        path: 'members/:id/edit',
        loadComponent: () =>
          import('./features/members/pages/member-form/member-form.component').then(m => m.MemberFormComponent),
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./features/loans/pages/loan-list/loan-list.component').then(m => m.LoanListComponent),
      },
      {
        path: 'loans/new',
        loadComponent: () =>
          import('./features/loans/pages/loan-form/loan-form.component').then(m => m.LoanFormComponent),
      },
      {
        path: 'profile/:id',
        loadComponent: () =>
          import('./features/profile/pages/profile/profile.component').then(m => m.Profile),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'admin/audit',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/pages/audit-log/audit-log.component').then(m => m.AuditLogComponent),
      },
      {
        path: 'admin/stock',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/pages/stock-manager/stock-manager.component').then(m => m.StockManagerComponent),
      },
      {
        path: 'admin/bookings',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/pages/bookings/bookings.component').then(m => m.Bookings),
      },
      {
        path: 'admin/messages',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/pages/messages/messages.component').then(m => m.Messages),
      },
    ],
  },
  { path: '**', redirectTo: 'catalog' },
];