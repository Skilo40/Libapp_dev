import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MemberService } from '../../../../core/services/member';
import { Member } from '../../../../core/models/member.model';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    CommonModule, NgFor, NgIf, RouterLink, FormsModule,
    MatIconModule, MatButtonModule, MatInputModule,
    MatFormFieldModule, MatProgressSpinnerModule, MatSnackBarModule,
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  loading = true;
  search = '';
  showInactive = false;

  constructor(
    private memberService: MemberService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: Record<string, string> = {};
    if (this.search) params['search'] = this.search;
    if (this.showInactive) params['isActive'] = 'false';

    this.memberService.getAll(params).subscribe({
      next: (res) => { this.members = res.members; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch() { this.load(); }
  clearSearch() { this.search = ''; this.load(); }
  toggleInactive() { this.showInactive = !this.showInactive; this.load(); }

  delete(member: Member) {
    if (!confirm(`Видалити читача "${member.firstName} ${member.lastName}"?`)) return;
    this.memberService.delete(member._id).subscribe({
      next: () => {
        this.snackBar.open('Читача видалено', 'OK', { duration: 3000, panelClass: 'success' });
        this.load();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Помилка', 'OK', { duration: 3000, panelClass: 'error' }),
    });
  }
}