import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  sidebarOpen = true;
  mobileMenuOpen = false;
  isMobile = window.innerWidth <= 600;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 600;
    if (!this.isMobile) this.mobileMenuOpen = false;
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    } else {
      this.sidebarOpen = !this.sidebarOpen;
    }
  }

  toggleMobile() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobile() {
    this.mobileMenuOpen = false;
  }
}