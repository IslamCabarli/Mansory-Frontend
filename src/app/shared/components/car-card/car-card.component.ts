import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Car } from '../../../core/models/car.model';
import { CarService } from '../../../core/services/car.service';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.scss'
})
export class CarCardComponent {
  @Input() car!: Car;

  constructor(private carService: CarService) {}

  getCarImage(): string {
    if (this.car.images && this.car.images.length > 0) {
      const primaryImage = this.car.images.find(img => img.is_primary);
      const imagePath = primaryImage ? primaryImage.image_path : this.car.images[0].image_path;
      return this.carService.getImageUrl(imagePath);
    }
    return 'assets/images/placeholder-car.jpg';
  }

  getStatusBadgeClass(): string {
    switch (this.car.status) {
      case 'available':
        return 'bg-green-500/20 text-green-400 border-green-500';
      case 'sold':
        return 'bg-red-500/20 text-red-400 border-red-500';
      case 'reserved':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  }

  getStatusText(): string {
    switch (this.car.status) {
      case 'available':
        return 'Available';
      case 'sold':
        return 'Sold';
      case 'reserved':
        return 'Reserved';
      default:
        return this.car.status;
    }
  }

  formatPrice(): string {
    if (!this.car.price) return 'Price on request';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.car.currency || 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(this.car.price);
  }
}