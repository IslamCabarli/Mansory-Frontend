import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CarService } from '../../core/services/car.service';
import { Car, CarImage } from '../../core/models/car.model';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  templateUrl: './car-detail.component.html',
  styleUrl: './car-detail.component.scss'
})
export class CarDetailComponent implements OnInit {
  car = signal<Car | null>(null);
  isLoading = signal(true);
  selectedImage = signal<CarImage | null>(null);
  activeTab = signal<'overview' | 'specs' | 'features'>('overview');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadCar(id);
      }
    });
  }

  loadCar(id: number): void {
    this.isLoading.set(true);
    this.carService.getById(id).subscribe({
      next: (response) => {
        if (response.success && !Array.isArray(response.data)) {
          this.car.set(response.data);
          
          // Set first image as selected
          if (response.data.images && response.data.images.length > 0) {
            const primary = response.data.images.find(img => img.is_primary);
            this.selectedImage.set(primary || response.data.images[0]);
          }
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading car:', error);
        this.isLoading.set(false);
        this.router.navigate(['/cars']);
      }
    });
  }

  getImageUrl(image: CarImage): string {
    return this.carService.getImageUrl(image.image_path);
  }

  selectImage(image: CarImage): void {
    this.selectedImage.set(image);
  }

  getStatusBadgeClass(): string {
    const status = this.car()?.status;
    switch (status) {
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

  formatPrice(): string {
    const car = this.car();
    if (!car || !car.price) return 'Price on request';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: car.currency || 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(car.price);
  }

  requestPrice(): void {
    alert('Contact us for pricing details');
  }
}