import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isSideMenuOpen = signal(false);
  isConfiguratorOpen = signal(false);
  isScrolled = signal(false);

  configuratorCars = [
    { id: 22, name: 'CULLINAN II', detailUrl: '/cars/22' },
    { id: 2, name: 'PUROSANGUE', detailUrl: '/cars/2' }
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 30);
  }

  toggleSideMenu() {
    this.isSideMenuOpen.update(value => !value);
    this.isConfiguratorOpen.set(false);
  }

  toggleConfigurator() {
    this.isConfiguratorOpen.update(value => !value);
  }

  selectConfiguratorCar(carUrl: string) {
    this.isConfiguratorOpen.set(false);
    this.isSideMenuOpen.set(false);
    this.router.navigate([carUrl]);
  }

  closeAllMenus() {
    this.isSideMenuOpen.set(false);
    this.isConfiguratorOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.isSideMenuOpen.set(false);
  }
}