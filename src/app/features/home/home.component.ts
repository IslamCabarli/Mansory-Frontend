import { Component, OnInit, signal } from '@angular/core';
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
export class HomeComponent implements OnInit {
  featuredCars = signal<Car[]>([]);
  brands = signal<Brand[]>([]);
  isLoading = signal(true);

  constructor(
    private carService: CarService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedCars();
    this.loadBrands();
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