import { Component, signal } from '@angular/core';
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

  // ✅ Configurator maşınları (2 maşın əlavə edəcəksən)
  configuratorCars = [
    { id: 1, name: 'CULLINAN II', detailUrl: '/cars/1' },
    { id: 2, name: 'PUROSANGUE', detailUrl: '/cars/2' }
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  // Sol tərəfdən açılan side menu
  toggleSideMenu() {
    this.isSideMenuOpen.update(value => !value);
    this.isConfiguratorOpen.set(false); // Configurator bağlan
  }

  // Configurator dropdown toggle
  toggleConfigurator() {
    this.isConfiguratorOpen.update(value => !value);
  }

  // Configurator maşın seçimi
  selectConfiguratorCar(carUrl: string) {
    this.isConfiguratorOpen.set(false);
    this.isSideMenuOpen.set(false);
    this.router.navigate([carUrl]);
  }

  // Backdrop click - close menus
  closeAllMenus() {
    this.isSideMenuOpen.set(false);
    this.isConfiguratorOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.isSideMenuOpen.set(false);
  }
}