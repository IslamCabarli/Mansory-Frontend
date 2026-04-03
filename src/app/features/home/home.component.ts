import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarService } from '../../core/services/car.service';
import { BrandService } from '../../core/services/brand.service';
import { Car } from '../../core/models/car.model';
import { Brand } from '../../core/models/brand.model';
import { CarCardComponent } from '../../shared/components/car-card/car-card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ModelFinderComponent } from '../model-finder/model-finder.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CarCardComponent, LoaderComponent, ModelFinderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredCars = signal<Car[]>([]);
  brands = signal<Brand[]>([]);
  isLoading = signal(true);

  sliderCars = signal<Car[]>([]);
  isSliderLoading = signal(true);
  currentSlide = signal(0);

  private sliderInterval: any;
  private readonly sliderIntervalMs = 5000;

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
    if (this.sliderInterval) clearInterval(this.sliderInterval);
  }

  get sliderCount() {
    return this.sliderCars().length;
  }

  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
  }

  private async preloadSliderCars(carItems: Car[]): Promise<void> {
    const urls = carItems.flatMap(car => {
      if (!car.images?.length) return [];
      const primary = car.images.find(img => img.is_primary);
      const path = primary ? primary.image_path : car.images[0].image_path;
      return [this.carService.getImageUrl(path)];
    });

    await Promise.all(
      urls
        .filter(Boolean)
        .map(url => this.preloadImage(url))
    );
  }

  loadSliderCars(): void {
    this.isSliderLoading.set(true);
    this.carService.getAll({ per_page: 11, is_featured: true }).subscribe({
      next: async (response) => {
        if (!response.success) { this.isSliderLoading.set(false); return; }

        const cars: Car[] = Array.isArray(response.data)
          ? response.data
          : (response.data as any).data ?? [];

        this.sliderCars.set(cars);
        this.currentSlide.set(0);

        if (cars.length) {
          await this.preloadSliderCars(cars);
        }

        this.isSliderLoading.set(false);
        this.startAutoSlider();
      },
      error: (error) => {
        console.error('Error loading slider cars:', error);
        this.isSliderLoading.set(false);
      }
    });
  }

  startAutoSlider(): void {
    if (this.sliderInterval) clearInterval(this.sliderInterval);
    this.sliderInterval = setInterval(() => this.nextSlide(), this.sliderIntervalMs);
  }

  nextSlide(): void {
    const total = this.sliderCount;
    if (total > 0) {
      this.currentSlide.update(v => (v + 1) % total);
    }
  }

  prevSlide(): void {
    const total = this.sliderCount;
    if (total > 0) {
      this.currentSlide.update(v => (v - 1 + total) % total);
    }
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
      this.startAutoSlider();
    }
  }

  getCarImage(car: Car): string {
    if (car.images?.length) {
      const primary = car.images.find(img => img.is_primary);
      const path = primary ? primary.image_path : car.images[0].image_path;
      return this.carService.getImageUrl(path);
    }
    return 'assets/images/placeholder-car.jpg';
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
      error: (error) => console.error('Error loading brands:', error)
    });
  }
}