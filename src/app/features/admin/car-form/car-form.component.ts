import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService } from '../../../core/services/car.service';
import { Car } from '../../../core/models/car.model';
import { Brand } from '../../../core/models/brand.model';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.scss'
})
export class CarFormComponent implements OnInit {
  @Input() car: Car | null = null;
  @Input() brands: Brand[] = [];
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  isLoading = signal(false);
  errorMessage = signal('');
  selectedImages: File[] = [];

  formData = {
    brand_id: 0,
    name: '',
    description: '',
    status: 'available',
    registration_year: '',
    mileage: 0,
    body_type: '',
    engine: '',
    fuel_type: '',
    transmission: '',
    power_hp: 0,
    power_kw: 0,
    v_max: 0,
    acceleration: '',
    price: 0,
    currency: 'EUR',
    color_exterior: '',
    color_interior: '',
    doors: 2,
    seats: 2,
    is_featured: false
  };

  ngOnInit(): void {
    if (this.car) {
      this.formData = {
        brand_id: this.car.brand_id,
        name: this.car.name,
        description: this.car.description || '',
        status: this.car.status,
        registration_year: this.car.registration_year || '',
        mileage: this.car.mileage || 0,
        body_type: this.car.body_type || '',
        engine: this.car.engine || '',
        fuel_type: this.car.fuel_type || '',
        transmission: this.car.transmission || '',
        power_hp: this.car.power_hp || 0,
        power_kw: this.car.power_kw || 0,
        v_max: this.car.v_max || 0,
        acceleration: this.car.acceleration || '',
        price: this.car.price || 0,
        currency: this.car.currency || 'EUR',
        color_exterior: this.car.color_exterior || '',
        color_interior: this.car.color_interior || '',
        doors: this.car.doors || 2,
        seats: this.car.seats || 2,
        is_featured: this.car.is_featured
      };
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedImages = Array.from(files);
    }
  }

  submit(): void {
    this.errorMessage.set('');

    if (!this.formData.brand_id || !this.formData.name || !this.formData.status) {
      this.errorMessage.set('Please fill in all required fields');
      return;
    }

    this.isLoading.set(true);

    if (this.car) {
      // Update existing car
      this.carService.update(this.car.id, this.formData).subscribe({
        next: (response) => {
          if (response.success) {
            // Upload images if any
            if (this.selectedImages.length > 0) {
              this.uploadImages(this.car!.id);
            } else {
              this.saved.emit();
              this.isLoading.set(false);
            }
          }
        },
        error: (error) => {
          console.error('Error updating car:', error);
          this.errorMessage.set(error.error?.message || 'Failed to update car');
          this.isLoading.set(false);
        }
      });
    } else {
      // Create new car
      this.carService.create(this.formData).subscribe({
        next: (response) => {
          if (response.success && !Array.isArray(response.data)) {
            const newCar = response.data;
            
            // Upload images if any
            if (this.selectedImages.length > 0) {
              this.uploadImages(newCar.id);
            } else {
              this.saved.emit();
              this.isLoading.set(false);
            }
          }
        },
        error: (error) => {
          console.error('Error creating car:', error);
          this.errorMessage.set(error.error?.message || 'Failed to create car');
          this.isLoading.set(false);
        }
      });
    }
  }

  uploadImages(carId: number): void {
    const formData = new FormData();
    this.selectedImages.forEach((file, index) => {
      formData.append('images[]', file, file.name);
    });
    formData.append('image_type', 'gallery');

    this.carService.addImages(carId, formData).subscribe({
      next: (response) => {
        this.saved.emit();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error uploading images:', error);
        this.errorMessage.set('Car saved but failed to upload images');
        this.isLoading.set(false);
      }
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}