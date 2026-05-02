import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MemberService } from '../../../../core/services/member';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatInputModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatSlideToggleModule,
  ],
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.scss'
})
export class MemberFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  saving = false;
  isEdit = false;
  memberId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      isActive: [true],
    });
  }

  ngOnInit() {
    this.memberId = this.route.snapshot.paramMap.get('id');
    if (this.memberId) {
      this.isEdit = true;
      this.loading = true;
      this.memberService.getOne(this.memberId).subscribe({
        next: (res) => { this.form.patchValue(res.member); this.loading = false; },
        error: () => { this.loading = false; this.router.navigate(['/members']); }
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;

    const action = this.isEdit
      ? this.memberService.update(this.memberId!, this.form.value)
      : this.memberService.create(this.form.value);

    action.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Читача оновлено' : 'Читача додано',
          'OK', { duration: 3000, panelClass: 'success' }
        );
        this.router.navigate(['/members']);
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err.error?.message || 'Помилка', 'OK', { duration: 3000, panelClass: 'error' });
      },
    });
  }
}