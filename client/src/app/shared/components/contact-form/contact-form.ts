import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MessageService } from '../../../core/services/message';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule, NgIf, ReactiveFormsModule,
    MatInputModule, MatButtonModule, MatIconModule,
    MatSnackBarModule, MatProgressSpinnerModule,
  ],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss'
})
export class ContactFormComponent {
  form: FormGroup;
  saving = false;
  sent = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      text: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;

    this.messageService.create(this.form.value).subscribe({
      next: () => {
        this.saving = false;
        this.sent = true;
        this.form.reset();
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Помилка надсилання', 'OK', { duration: 3000, panelClass: 'error' });
      },
    });
  }
}