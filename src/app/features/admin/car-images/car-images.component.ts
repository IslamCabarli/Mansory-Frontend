import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarService } from '../../../core/services/car.service';
import { Car, CarImage } from '../../../core/models/car.model';

@Component({
  selector: 'app-car-images',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-images.component.html',
  styleUrl: './car-images.component.scss'
})
export class CarImagesComponent {
  @Input() car!: Car;
  @Output() imageChanged = new EventEmitter<void>(); // Yenilənmə üçün event
  
  isUploading = signal(false);
  selectedFiles: File[] = [];

  constructor(private carService: CarService) {}

  private refreshLocalImagesFromCar(): void {
    if (!this.car) return;
    this.car.images = this.car.images ?? [];
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
  }

  uploadImages(): void {
    if (this.selectedFiles.length === 0 || !this.car) return;

    this.isUploading.set(true);
    const formData = new FormData();
    
    this.selectedFiles.forEach((file) => {
      formData.append('images[]', file, file.name);
    });
    formData.append('image_type', 'gallery');

    this.carService.addImages(this.car.id, formData).subscribe({
      next: (response: any) => {
        this.isUploading.set(false);
        this.selectedFiles = [];

        // Prefer API returned images if available
        const newImages: CarImage[] | undefined = response?.data?.images ?? response?.images;
        if (Array.isArray(newImages) && newImages.length > 0) {
          this.car.images = [...(this.car.images ?? []), ...newImages];
        } else {
          // Fallback: refetch car from API and merge
          this.reloadCarImages();
        }

        this.imageChanged.emit();
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Failed to upload images');
        this.isUploading.set(false);
      }
    });
  }

  deleteImage(image: CarImage): void {
    if (!this.car) return;

    this.carService.deleteImage(this.car.id, image.id).subscribe({
      next: () => {
        this.car.images = (this.car.images ?? []).filter(img => img.id !== image.id);
        this.imageChanged.emit();
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Failed to delete image');
      }
    });
  }

  setPrimary(image: CarImage): void {
    if (!this.car) return;

    this.carService.setPrimaryImage(this.car.id, image.id).subscribe({
      next: (response: any) => {
        if (Array.isArray(this.car.images)) {
          this.car.images = this.car.images.map(img => ({
            ...img,
            is_primary: img.id === image.id
          }));
        }

        // Keep explicit primary image field if used by parent
        this.car.primary_image = image;

        // If API returns current images, sync using best response
        const updatedImages: CarImage[] | undefined = response?.data?.images ?? response?.images;
        if (Array.isArray(updatedImages)) {
          this.car.images = updatedImages;
        }

        this.imageChanged.emit();
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Failed to set primary image');
      }
    });
  }

  private reloadCarImages(): void {
    if (!this.car) return;
    this.carService.getById(this.car.id).subscribe({
      next: (resp) => {
        if (resp?.data && (resp.data as Car).images) {
          this.car.images = (resp.data as Car).images ?? [];
        }
      },
      error: (error) => {
        console.error('Could not refresh car images', error);
      }
    });
  }

  getImageUrl(image: CarImage): string {
    return this.carService.getImageUrl(image.image_path);
  }
}