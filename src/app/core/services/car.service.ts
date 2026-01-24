import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Car, CarResponse, CarFilters } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = `${environment.apiUrl}/cars`;

  constructor(private http: HttpClient) {}

  // Get all cars with filters
  getAll(filters?: CarFilters): Observable<CarResponse> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<CarResponse>(this.apiUrl, { params });
  }

  // Get featured cars
  getFeatured(): Observable<CarResponse> {
    return this.http.get<CarResponse>(`${environment.apiUrl}/cars-featured`);
  }

  // Get cars by brand
  getByBrand(brandId: number): Observable<CarResponse> {
    return this.http.get<CarResponse>(`${environment.apiUrl}/brands/${brandId}/cars`);
  }

  // Get car by ID
  getById(id: number): Observable<CarResponse> {
    return this.http.get<CarResponse>(`${this.apiUrl}/${id}`);
  }

  // Create car (Admin only)
  create(car: any): Observable<CarResponse> {
    return this.http.post<CarResponse>(this.apiUrl, car);
  }

  // Update car (Admin only)
  update(id: number, car: any): Observable<CarResponse> {
    return this.http.put<CarResponse>(`${this.apiUrl}/${id}`, car);
  }

  // Delete car (Admin only)
  delete(id: number): Observable<CarResponse> {
    return this.http.delete<CarResponse>(`${this.apiUrl}/${id}`);
  }

  // Add images to car (Admin only)
  addImages(carId: number, images: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${carId}/images`, images);
  }

  // Delete car image (Admin only)
  deleteImage(carId: number, imageId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${carId}/images/${imageId}`);
  }

  // Set primary image (Admin only)
  setPrimaryImage(carId: number, imageId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${carId}/images/${imageId}/primary`, {});
  }

  // Helper: Get image URL
  getImageUrl(path: string): string {
    if (!path) return 'assets/images/placeholder-car.jpg';
    return `${environment.imageUrl}/${path}`;
  }
}