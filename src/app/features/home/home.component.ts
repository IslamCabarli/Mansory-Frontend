import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarService } from '../../core/services/car.service';
import { BrandService } from '../../core/services/brand.service';
import { Car } from '../../core/models/car.model';
import { Brand } from '../../core/models/brand.model';
import { CarCardComponent } from '../../shared/components/car-card/car-card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CarCardComponent, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredCars = signal<Car[]>([]);
  brands = signal<Brand[]>([]);
  isLoading = signal(true);
  
  // Slider
  sliderCars = signal<Car[]>([]);
  currentSlide = signal(0);
  private sliderInterval: any;

  constructor(
    private carService: CarService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedCars();
    this.loadBrands();
    this.loadSliderCars();
  }

  ngOnDestroy(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  loadSliderCars(): void {
    // İlk 11 featured car-ı yüklə
    this.carService.getAll({ per_page: 11, is_featured: true }).subscribe({
      next: (response) => {
        if (response.success) {
          const data: any = response.data;
          if (data.data) {
            this.sliderCars.set(data.data);
          } else if (Array.isArray(response.data)) {
            this.sliderCars.set(response.data);
          }
          
          // Auto slider başlat - 5 saniyədə bir
          this.startAutoSlider();
        }
      },
      error: (error) => {
        console.error('Error loading slider cars:', error);
      }
    });
  }

  startAutoSlider(): void {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    const total = this.sliderCars().length;
    if (total > 0) {
      this.currentSlide.update(val => (val + 1) % total);
    }
  }

  prevSlide(): void {
    const total = this.sliderCars().length;
    if (total > 0) {
      this.currentSlide.update(val => (val - 1 + total) % total);
    }
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    // Reset auto slider
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
      this.startAutoSlider();
    }
  }

  getCarImage(car: Car): string {
    if (car.images && car.images.length > 0) {
      const primary = car.images.find(img => img.is_primary);
      const imagePath = primary ? primary.image_path : car.images[0].image_path;
      return this.carService.getImageUrl(imagePath);
    }
    return 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?q=80&w=2340';
  }

  loadFeaturedCars(): void {
    this.carService.getFeatured().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.featuredCars.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading featured cars:', error);
        this.isLoading.set(false);
      }
    });
  }

  loadBrands(): void {
    this.brandService.getAll().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.brands.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading brands:', error);
      }
    });
  }
}