import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, LoginComponent, DashboardComponent],
  template: `
    @if (authService.isLoggedIn()) {
      <app-dashboard />
    } @else {
      <app-login />
    }
  `
})
export class AdminComponent {
  constructor(public authService: AuthService) {}
}