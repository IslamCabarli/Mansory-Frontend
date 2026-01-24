import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen = signal(false);

  constructor(public authService: AuthService) {}

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen.set(false);
  }
}