import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService, Stats } from '../../../../core/services/admin';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, NgIf, RouterLink,
    MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  stats: Stats | null = null;
  loading = true;

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.adminService.getStats().subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}