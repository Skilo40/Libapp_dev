import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NgFor, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Input() mobileOpen = false;

  navItems: NavItem[] = [
  { label: 'Каталог', icon: 'auto_stories', route: '/catalog' },
  { label: 'Дашборд', icon: 'dashboard', route: '/dashboard',adminOnly: true },
  { label: 'Книги', icon: 'menu_book', route: '/books',adminOnly: true },
  { label: 'Читачі', icon: 'people', route: '/members',adminOnly: true },
  { label: 'Позики', icon: 'swap_horiz', route: '/loans',adminOnly: true },
  { label: 'Адмін панель', icon: 'admin_panel_settings', route: '/admin', adminOnly: true },
  { label: 'Бронювання', icon: 'bookmark', route: '/admin/bookings', adminOnly: true },
  { label: 'Повідомлення', icon: 'message', route: '/admin/messages', adminOnly: true },
  { label: 'Журнал аудиту', icon: 'history', route: '/admin/audit', adminOnly: true },
  { label: 'Управління запасами', icon: 'inventory', route: '/admin/stock', adminOnly: true },
];

  constructor(public auth: AuthService) {}

  get visibleItems(): NavItem[] {
    return this.navItems.filter(i => !i.adminOnly || this.auth.isAdmin());
  }
}