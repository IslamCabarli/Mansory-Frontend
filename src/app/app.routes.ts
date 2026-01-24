import { Routes } from '@angular/router';
import { authGuard,} from './core/guards/auth.guard';

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
    path: 'cars/:id',
    loadComponent: () => import('./features/car-detail/car-detail.component').then(m => m.CarDetailComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];