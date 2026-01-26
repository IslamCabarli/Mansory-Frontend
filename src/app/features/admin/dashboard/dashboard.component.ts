import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CarService } from '../../../core/services/car.service';
import { BrandService } from '../../../core/services/brand.service';
import { Car } from '../../../core/models/car.model';
import { Brand } from '../../../core/models/brand.model';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CarFormComponent } from '../car-form/car-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent, CarFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  cars = signal<Car[]>([]);
  brands = signal<Brand[]>([]);
  isLoading = signal(true);
  activeView = signal<'list' | 'create' | 'edit'>('list');
  selectedCar = signal<Car | null>(null);

  constructor(
    public authService: AuthService,
    private carService: CarService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    
    // Load cars
    this.carService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          const data: any = response.data;
          if (data.data) {
            this.cars.set(data.data);
          } else if (Array.isArray(response.data)) {
            this.cars.set(response.data);
          }
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        this.isLoading.set(false);
      }
    });

    // Load brands
    this.brandService.getAll().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.brands.set(response.data);
        }
      },
      error: (error) => console.error('Error loading brands:', error)
    });
  }

  showCreateForm(): void {
    this.selectedCar.set(null);
    this.activeView.set('create');
  }

  showEditForm(car: Car): void {
    this.selectedCar.set(car);
    this.activeView.set('edit');
  }

  cancelForm(): void {
    this.selectedCar.set(null);
    this.activeView.set('list');
  }

  onCarSaved(): void {
    this.loadData();
    this.activeView.set('list');
  }

  deleteCar(car: Car): void {
    if (confirm(`Are you sure you want to delete "${car.name}"?`)) {
      this.carService.delete(car.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadData();
          }
        },
        error: (error) => {
          console.error('Error deleting car:', error);
          alert('Failed to delete car');
        }
      });
    }
  }

  getImageUrl(car: Car): string {
    if (car.images && car.images.length > 0) {
      const primary = car.images.find(img => img.is_primary);
      const imagePath = primary ? primary.image_path : car.images[0].image_path;
      return this.carService.getImageUrl(imagePath);
    }
    return 'assets/images/placeholder-car.jpg';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-400';
      case 'sold': return 'bg-red-500/20 text-red-400';
      case 'reserved': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  }

  getAvailableCarsCount(): number {
    return this.cars().filter(car => car.status === 'available').length;
  }
}