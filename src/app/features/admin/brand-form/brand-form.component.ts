import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../core/services/brand.service';
import { Brand } from '../../../core/models/brand.model';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss'
})
export class BrandFormComponent implements OnInit {
  isEditMode = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal('');
  
  brandId: number | null = null;
  
  formData = {
    name: '',
    slug: '',
    description: '',
    is_active: true
  };

  constructor(
    private brandService: BrandService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEditMode.set(true);
      this.brandId = parseInt(id);
      this.loadBrand();
    }
  }

  loadBrand(): void {
    if (!this.brandId) return;

    this.brandService.getById(this.brandId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const brand = response.data;
          if (!Array.isArray(brand)) {
            this.formData = {
              name: brand.name,
              slug: brand.slug,
              description: brand.description || '',
              is_active: brand.is_active
            };
          }
        }
      },
      error: (error) => {
        console.error('Error loading brand:', error);
        this.errorMessage.set('Failed to load brand');
      }
    });
  }

  generateSlug(): void {
    if (this.formData.name) {
      this.formData.slug = this.formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  }

  onSubmit(): void {
    if (!this.formData.name.trim()) {
      this.errorMessage.set('Brand name is required');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const formDataToSubmit = this.convertToFormData(this.formData);

    const operation = this.isEditMode()
      ? this.brandService.update(this.brandId!, formDataToSubmit)
      : this.brandService.create(formDataToSubmit);

    operation.subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/admin/brands']);
        } else {
          this.errorMessage.set(response.message || 'Operation failed');
          this.isSubmitting.set(false);
        }
      },
      error: (error) => {
        console.error('Error saving brand:', error);
        this.errorMessage.set(error.error?.message || 'Failed to save brand');
        this.isSubmitting.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/brands']);
  }

  private convertToFormData(data: any): FormData {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return formData;
  }
}