import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'cars',
    loadComponent: () => import('./features/cars/cars.component').then(m => m.CarsComponent)
  },
  {
    path: 'models',
    loadComponent: () => import('./features/models/models.component').then(m => m.ModelsComponent)
  },
  {
    path: 'cars/:id',
    loadComponent: () => import('./features/car-detail/car-detail.component').then(m => m.CarDetailComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
  },
  
  // Admin Routes
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard]
  },
  
  // Brand Management Routes
  {
    path: 'admin/brands',
    loadComponent: () => import('./features/admin/brand-list/brand-list.component').then(m => m.BrandListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/brands/create',
    loadComponent: () => import('./features/admin/brand-form/brand-form.component').then(m => m.BrandFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/brands/edit/:id',
    loadComponent: () => import('./features/admin/brand-form/brand-form.component').then(m => m.BrandFormComponent),
    canActivate: [AuthGuard]
  },
  
  {
    path: '**',
    redirectTo: 'home'
  }
];