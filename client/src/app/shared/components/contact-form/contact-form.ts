import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MessageService } from '../../../core/services/message';
import { AuthService } from '../../../core/services/auth';

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
export class ContactFormComponent implements OnInit {
  form: FormGroup;
  saving = false;
  sent = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      text: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Якщо користувач залогінений - автоматично заповнити name та email
    const user = this.authService.currentUser();
    if (user) {
      let fullName = '';
      
      // Спочатку спробуємо firstName + lastName
      if (user.firstName || user.lastName) {
        fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      } 
      // Якщо їх немає - використаємо name
      else if (user.name) {
        fullName = user.name;
      }

      this.form.patchValue({
        name: fullName,
        email: user.email,
      });
      // Заблокувати ці поля для редагування
      this.form.get('name')?.disable();
      this.form.get('email')?.disable();
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;

    // Отримати значення включаючи disabled поля
    const formValue = {
      name: this.form.get('name')?.value,
      email: this.form.get('email')?.value,
      subject: this.form.get('subject')?.value,
      text: this.form.get('text')?.value,
    };

    this.messageService.create(formValue).subscribe({
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