import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';
import { Member } from '../models/member.model';

export interface CatalogFilters {
  search: string;
  selectedGenre: string;
  selectedLanguage: string;
  showAvailable: boolean;
  sortBy: string;
}

@Injectable({ providedIn: 'root' })
export class StateService {
  currentUser = signal<User | null>(null);
  currentMember = signal<Member | null>(null);

  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isLibrarian = computed(() => this.currentUser()?.role === 'librarian');
  isMember = computed(() => this.currentUser()?.role === 'member');

  catalogFilters = signal<CatalogFilters>({
    search: '',
    selectedGenre: '',
    selectedLanguage: '',
    showAvailable: false,
    sortBy: 'createdAt',
  });

  setUser(user: User | null) {
    this.currentUser.set(user);
  }

  setMember(member: Member | null) {
    this.currentMember.set(member);
  }

  setCatalogFilters(filters: Partial<CatalogFilters>) {
    this.catalogFilters.update(prev => ({ ...prev, ...filters }));
  }

  resetCatalogFilters() {
    this.catalogFilters.set({
      search: '',
      selectedGenre: '',
      selectedLanguage: '',
      showAvailable: false,
      sortBy: 'createdAt',
    });
  }

  clearAuth() {
    this.currentUser.set(null);
    this.currentMember.set(null);
  }
}