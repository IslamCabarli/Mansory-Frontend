import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BrandService } from '../../../core/services/brand.service';
import { Brand } from '../../../core/models/brand.model';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss'
})
export class BrandListComponent implements OnInit {
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
          this.brands.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading brands:', error);
        this.isLoading.set(false);
      }
    });
  }

  editBrand(brandId: number): void {
    this.router.navigate(['/admin/brands/edit', brandId]);
  }

  deleteBrand(brand: Brand): void {
    if (!confirm(`Are you sure you want to delete "${brand.name}"?`)) {
      return;
    }

    this.brandService.delete(brand.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadBrands();
        } else {
          alert(response.message || 'Failed to delete brand');
        }
      },
      error: (error) => {
        console.error('Error deleting brand:', error);
        alert('Failed to delete brand');
      }
    });
  }

toggleActive(brand: Brand): void {
  
  const updateData = {
    name: brand.name,
    slug: brand.slug,
    description: brand.description || '',
    is_active: !brand.is_active
  };

  this.brandService.update(brand.id, updateData).subscribe({
    next: (response) => {
      if (response.success) {
        this.loadBrands();
      }
    },
    error: (error) => {
      console.error('Error updating brand:', error);
      alert('Failed to update brand status');
    }
  });
}
}