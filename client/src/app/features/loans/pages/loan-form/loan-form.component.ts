import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LoanService } from '../../../../core/services/loan';
import { BookService } from '../../../../core/services/book';
import { MemberService } from '../../../../core/services/member';
import { Book } from '../../../../core/models/book.model';
import { Member } from '../../../../core/models/member.model';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [
    CommonModule, NgIf, NgFor, ReactiveFormsModule, RouterLink,
    MatInputModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatAutocompleteModule,
  ],
  templateUrl: './loan-form.component.html',
  styleUrl: './loan-form.component.scss'
})
export class LoanFormComponent implements OnInit {
  form: FormGroup;
  saving = false;
  books: Book[] = [];
  members: Member[] = [];
  filteredBooks: Book[] = [];
  filteredMembers: Member[] = [];
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private bookService: BookService,
    private memberService: MemberService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      bookId: ['', Validators.required],
      memberId: ['', Validators.required],
      dueDate: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit() {
    this.bookService.getAll({ available: 'true' }).subscribe(res => {
      this.books = res.books;
      this.filteredBooks = res.books;
    });
    this.memberService.getAll({ isActive: 'true' }).subscribe(res => {
      this.members = res.members;
      this.filteredMembers = res.members;
    });
  }

  filterBooks(search: string) {
    const s = search.toLowerCase();
    this.filteredBooks = this.books.filter(b =>
      b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s)
    );
  }

  filterMembers(search: string) {
    const s = search.toLowerCase();
    this.filteredMembers = this.members.filter(m =>
      m.firstName.toLowerCase().includes(s) ||
      m.lastName.toLowerCase().includes(s) ||
      m.email.toLowerCase().includes(s)
    );
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;

    const value = {
      ...this.form.value,
      dueDate: new Date(this.form.value.dueDate).toISOString(),
    };

    this.loanService.create(value).subscribe({
      next: () => {
        this.snackBar.open('Книгу видано', 'OK', { duration: 3000, panelClass: 'success' });
        this.router.navigate(['/loans']);
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err.error?.message || 'Помилка', 'OK', { duration: 3000, panelClass: 'error' });
      },
    });
  }
}