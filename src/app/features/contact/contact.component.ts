import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal('');

  formData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  onSubmit(): void {
    this.isSubmitting.set(true);
    this.submitError.set('');
    this.submitSuccess.set(false);

    // Simulate API call
    setTimeout(() => {
      // Success
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
      
      // Reset form
      this.formData = {
        name: '',
        email: '',
        phone: '',
        message: ''
      };

      // Hide success message after 5 seconds
      setTimeout(() => {
        this.submitSuccess.set(false);
      }, 5000);
    }, 1500);
  }
}