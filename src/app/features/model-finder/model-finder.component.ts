import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandService } from '../../core/services/brand.service';
import { CarService } from '../../core/services/car.service';
import { Brand } from '../../core/models/brand.model';

@Component({
  selector: 'app-model-finder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './model-finder.component.html',
  styleUrl: './model-finder.component.scss'
})
export class ModelFinderComponent implements OnInit {
  brands = signal<Brand[]>([]);
  models = signal<string[]>([]);
  
  selectedBrand = signal<number | null>(null);
  selectedModel = signal<string>('');

  constructor(
    private brandService: BrandService,
    private carService: CarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.brandService.getAll().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          const activeBrands = response.data.filter(b => b.is_active);
          this.brands.set(activeBrands);
        }
      },
      error: (error) => console.error('Error loading brands:', error)
    });
  }

  onBrandChange(brandId: number): void {
    this.selectedBrand.set(brandId);
    this.selectedModel.set('');
    
    // Load models for selected brand
    this.carService.getAll({ brand_id: brandId, per_page: 100 }).subscribe({
      next: (response) => {
        if (response.success) {
          const data: any = response.data;
          const cars = data.data || response.data;
          
          // Extract unique model names
          const uniqueModels = [...new Set(cars.map((car: any) => car.name))] as string[];
          this.models.set(uniqueModels);
        }
      },
      error: (error) => console.error('Error loading models:', error)
    });
  }

  search(): void {
    if (!this.selectedBrand()) {
      alert('Please select a brand');
      return;
    }

    const queryParams: any = { brand_id: this.selectedBrand() };
    
    if (this.selectedModel()) {
      queryParams.search = this.selectedModel();
    }

    this.router.navigate(['/cars'], { queryParams });
  }
}