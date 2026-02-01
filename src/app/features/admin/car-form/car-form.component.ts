import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService } from '../../../core/services/car.service';
import { Car, CarSpecification } from '../../../core/models/car.model';
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

  // ===== SPECIFICATIONS =====
  specifications = signal<CarSpecification[]>([]);
  
  newSpec = {
    spec_key: '',
    spec_label: '',
    spec_value: '',
    spec_unit: '',
    spec_category: 'general',
    sort_order: 0
  };

  specCategories = [
    { value: 'general', label: 'General' },
    { value: 'performance', label: 'Performance' },
    { value: 'engine', label: 'Engine' },
    { value: 'dimensions', label: 'Dimensions' },
    { value: 'interior', label: 'Interior' },
    { value: 'exterior', label: 'Exterior' },
    { value: 'safety', label: 'Safety' },
    { value: 'technology', label: 'Technology' }
  ];
  // ===========================

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

  constructor(private carService: CarService) {}

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

      // Load existing specifications
      if (this.car.specifications && this.car.specifications.length > 0) {
        this.specifications.set([...this.car.specifications]);
      }
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedImages = Array.from(files);
    }
  }

  // ===== SPECIFICATIONS METHODS =====
  addSpecification(): void {
    if (!this.newSpec.spec_label || !this.newSpec.spec_value) {
      this.errorMessage.set('Please fill in specification Label and Value');
      return;
    }

    if (!this.newSpec.spec_key) {
      this.newSpec.spec_key = this.newSpec.spec_label
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    }

    const newSpecification: CarSpecification = {
      id: 0,
      car_id: this.car?.id || 0,
      spec_key: this.newSpec.spec_key,
      spec_label: this.newSpec.spec_label,
      spec_value: this.newSpec.spec_value,
      spec_unit: this.newSpec.spec_unit || '',
      spec_category: this.newSpec.spec_category,
      sort_order: this.specifications().length,
      created_at: '',
      updated_at: ''
    };

    this.specifications.update(specs => [...specs, newSpecification]);
    this.errorMessage.set('');

    // Reset
    this.newSpec = {
      spec_key: '',
      spec_label: '',
      spec_value: '',
      spec_unit: '',
      spec_category: 'general',
      sort_order: 0
    };
  }

  removeSpecification(index: number): void {
    this.specifications.update(specs => specs.filter((_, i) => i !== index));
  }

  moveSpecUp(index: number): void {
    if (index === 0) return;
    this.specifications.update(specs => {
      const arr = [...specs];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr.map((spec, i) => ({ ...spec, sort_order: i }));
    });
  }

  moveSpecDown(index: number): void {
    if (index === this.specifications().length - 1) return;
    this.specifications.update(specs => {
      const arr = [...specs];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr.map((spec, i) => ({ ...spec, sort_order: i }));
    });
  }

  getSpecsByCategory(category: string): CarSpecification[] {
    return this.specifications().filter(s => s.spec_category === category);
  }
  getGlobalIndex(spec: CarSpecification): number {
    return this.specifications().indexOf(spec);
  }
 

  submit(): void {
    this.errorMessage.set('');

    if (!this.formData.brand_id || !this.formData.name || !this.formData.status) {
      this.errorMessage.set('Please fill in all required fields');
      return;
    }

    this.isLoading.set(true);

    // Specifications daxil edim
    const carData = {
      ...this.formData,
      specifications: this.specifications()
    };

    if (this.car) {
      this.carService.update(this.car.id, carData).subscribe({
        next: (response) => {
          if (response.success) {
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
      this.carService.create(carData).subscribe({
        next: (response) => {
          if (response.success && !Array.isArray(response.data) && 'id' in response.data) {
            const newCar = response.data as Car;

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
    this.selectedImages.forEach((file) => {
      formData.append('images[]', file, file.name);
    });
    formData.append('image_type', 'gallery');

    this.carService.addImages(carId, formData).subscribe({
      next: () => {
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