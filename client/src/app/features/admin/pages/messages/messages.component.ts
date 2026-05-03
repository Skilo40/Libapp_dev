import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MessageService } from '../../../../core/services/message';
import { Message } from '../../../../core/models/message.model';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule, NgFor, NgIf, FormsModule, RouterLink,
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatSelectModule, MatInputModule,
    MatProgressSpinnerModule, MatSnackBarModule,
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.scss'
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  loading = true;
  statusFilter = 'new';
  selectedMessage: Message | null = null;
  replyText = '';
  replying = false;

  constructor(
    private messageService: MessageService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: Record<string, string> = {};
    if (this.statusFilter) params['status'] = this.statusFilter;

    this.messageService.getAll(params).subscribe({
      next: (res) => { this.messages = res.messages; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  sendReply() {
    if (!this.replyText.trim() || !this.selectedMessage) return;
    this.replying = true;

    this.messageService.reply(this.selectedMessage._id, this.replyText).subscribe({
      next: () => {
        this.replying = false;
        this.selectedMessage = null;
        this.replyText = '';
        this.snackBar.open('Відповідь надіслано', 'OK', { duration: 3000, panelClass: 'success' });
        this.load();
      },
      error: () => {
        this.replying = false;
        this.snackBar.open('Помилка', 'OK', { duration: 3000, panelClass: 'error' });
      },
    });
  }
}