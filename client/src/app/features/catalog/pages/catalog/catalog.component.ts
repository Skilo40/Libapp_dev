import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { CatalogService } from '../../../../core/services/catalog';
import { AuthService } from '../../../../core/services/auth';
import { StateService } from '../../../../core/services/state';
import { Book } from '../../../../core/models/book.model';
import { ContactFormComponent } from '../../../../shared/components/contact-form/contact-form';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule, NgFor, NgIf, RouterLink, FormsModule,
    MatIconModule, MatButtonModule, MatInputModule,
    MatFormFieldModule, MatSelectModule,
    MatProgressSpinnerModule, MatMenuModule, ContactFormComponent,
  ],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss'
})
export class CatalogComponent implements OnInit {
  books: Book[] = [];
  loading = true;
  genres: string[] = [];
  languages: string[] = [];
  showContactModal = false;

  search = '';
  selectedGenre = '';
  selectedLanguage = '';
  showAvailable = false;
  sortBy = 'createdAt';

  constructor(
    private catalogService: CatalogService,
    public auth: AuthService,
    public state: StateService,
  ) {}

  ngOnInit() {
    // Відновити фільтри зі стейту
    const saved = this.state.catalogFilters();
    this.search = saved.search;
    this.selectedGenre = saved.selectedGenre;
    this.selectedLanguage = saved.selectedLanguage;
    this.showAvailable = saved.showAvailable;
    this.sortBy = saved.sortBy;

    this.catalogService.getFilters().subscribe(res => {
      this.genres = res.genres;
      this.languages = res.languages;
    });
    this.load();
  }

  load() {
    this.loading = true;

    // Зберегти фільтри в стейт
    this.state.setCatalogFilters({
      search: this.search,
      selectedGenre: this.selectedGenre,
      selectedLanguage: this.selectedLanguage,
      showAvailable: this.showAvailable,
      sortBy: this.sortBy,
    });

    const params: Record<string, string> = {};
    if (this.search) params['search'] = this.search;
    if (this.selectedGenre) params['genre'] = this.selectedGenre;
    if (this.selectedLanguage) params['bookLanguage'] = this.selectedLanguage;
    if (this.showAvailable) params['available'] = 'true';
    if (this.sortBy) params['sortBy'] = this.sortBy;

    this.catalogService.getBooks(params).subscribe({
      next: (res) => { this.books = res.books; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  clearFilters() {
    this.search = '';
    this.selectedGenre = '';
    this.selectedLanguage = '';
    this.showAvailable = false;
    this.sortBy = 'createdAt';
    this.state.resetCatalogFilters();
    this.load();
  }

  closeModal(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showContactModal = false;
    }
  }

  getMemberProfileId(): string {
    return this.state.currentUser()?._id || '';
  }
}