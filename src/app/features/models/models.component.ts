import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BrandService } from '../../core/services/brand.service';
import { Brand } from '../../core/models/brand.model';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-models',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss'
})
export class ModelsComponent implements OnInit {
  brands = signal<Brand[]>([]);
  isLoading = signal(true);

  constructor(
    private brandService: BrandService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.isLoading.set(true);
    
    this.brandService.getAll().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          // Only show active brands
          const activeBrands = response.data.filter(brand => brand.is_active);
          this.brands.set(activeBrands);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading brands:', error);
        this.isLoading.set(false);
      }
    });
  }

  viewBrandCars(brand: Brand): void {
    // Navigate to cars page with brand filter
    this.router.navigate(['/cars'], { 
      queryParams: { brand: brand.id } 
    });
  }

  getLogoUrl(brand: Brand): string {
    return brand.logo_url || 'assets/images/placeholder-logo.png';
  }
}