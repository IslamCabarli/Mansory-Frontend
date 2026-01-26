import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage.set('');
    
    if (!this.email || !this.password) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    this.isLoading.set(true);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        if (response.success) {
          if (response.data.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.errorMessage.set('Admin access required');
            this.authService.logout();
          }
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage.set(error.error?.message || 'Invalid credentials');
        this.isLoading.set(false);
      }
    });
  }
}