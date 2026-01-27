import { Component, Input, signal } from '@angular/core';
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
  
  isUploading = signal(false);
  selectedFiles: File[] = [];

  constructor(private carService: CarService) {}

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
      next: (response) => {
        console.log('Images uploaded:', response);
        this.isUploading.set(false);
        this.selectedFiles = [];
        // Reload car data
        window.location.reload();
      },
      error: (error) => {
        console.error('Error uploading images:', error);
        alert('Failed to upload images');
        this.isUploading.set(false);
      }
    });
  }

  deleteImage(image: CarImage): void {
    if (!confirm('Are you sure you want to delete this image?')) return;

    this.carService.deleteImage(this.car.id, image.id).subscribe({
      next: () => {
        console.log('Image deleted');
        window.location.reload();
      },
      error: (error) => {
        console.error('Error deleting image:', error);
        alert('Failed to delete image');
      }
    });
  }

  setPrimary(image: CarImage): void {
    this.carService.setPrimaryImage(this.car.id, image.id).subscribe({
      next: () => {
        console.log('Primary image set');
        window.location.reload();
      },
      error: (error) => {
        console.error('Error setting primary image:', error);
        alert('Failed to set primary image');
      }
    });
  }

  getImageUrl(image: CarImage): string {
    return this.carService.getImageUrl(image.image_path);
  }
}