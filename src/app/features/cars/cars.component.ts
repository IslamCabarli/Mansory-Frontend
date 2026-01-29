import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarService } from '../../core/services/car.service';
import { BrandService } from '../../core/services/brand.service';
import { Car, CarFilters, PaginatedCars } from '../../core/models/car.model';
import { Brand } from '../../core/models/brand.model';
import { CarCardComponent } from '../../shared/components/car-card/car-card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, FormsModule, CarCardComponent, LoaderComponent],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.scss'
})
export class CarsComponent implements OnInit {
  cars = signal<Car[]>([]);
  brands = signal<Brand[]>([]);
  isLoading = signal(true);
  
  // Pagination
  currentPage = signal(1);
  totalPages = signal(1);
  totalCars = signal(0);

  // Filters
  filters: CarFilters = {
    search: '',
    brand_id: undefined,
    status: undefined,
    min_price: undefined,
    max_price: undefined,
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 12,
    page: 1
  };

  constructor(
    private carService: CarService,
    private brandService: BrandService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBrands();
    

    this.route.queryParams.subscribe(params => {
      if (params['brand_id']) {
        this.filters.brand_id = +params['brand_id'];
      }
      this.loadCars();
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

  loadCars(): void {
    this.isLoading.set(true);
    
    const cleanFilters: any = {};
    Object.keys(this.filters).forEach(key => {
      const value = (this.filters as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        cleanFilters[key] = value;
      }
    });

    this.carService.getAll(cleanFilters).subscribe({
      next: (response) => {
        if (response.success) {
          const data = response.data as PaginatedCars;
          this.cars.set(data.data);
          this.currentPage.set(data.current_page);
          this.totalPages.set(data.last_page);
          this.totalCars.set(data.total);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        this.isLoading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.loadCars();
  }

  resetFilters(): void {
    this.filters = {
      search: '',
      brand_id: undefined,
      status: undefined,
      min_price: undefined,
      max_price: undefined,
      sort_by: 'created_at',
      sort_order: 'desc',
      per_page: 12,
      page: 1
    };
    this.router.navigate(['/cars']);
    this.loadCars();
  }

  changePage(page: number): void {
    this.filters.page = page;
    this.loadCars();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pages(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range = [];
    
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift(-1);
    }
    if (current + delta < total - 1) {
      range.push(-1);
    }

    range.unshift(1);
    if (total > 1) {
      range.push(total);
    }

    return range;
  }
}