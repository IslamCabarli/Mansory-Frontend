import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Brand, BrandResponse } from '../models/brand.model';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = `${environment.apiUrl}/brands`;

  constructor(private http: HttpClient) {}

  // Get all brands
  getAll(): Observable<BrandResponse> {
    return this.http.get<BrandResponse>(this.apiUrl);
  }

  // Get brand by ID
  getById(id: number): Observable<BrandResponse> {
    return this.http.get<BrandResponse>(`${this.apiUrl}/${id}`);
  }

  // Create brand (Admin only)
  create(brand: FormData): Observable<BrandResponse> {
    return this.http.post<BrandResponse>(this.apiUrl, brand);
  }

  // Update brand (Admin only)
  update(id: number, brand: FormData): Observable<BrandResponse> {
    return this.http.post<BrandResponse>(`${this.apiUrl}/${id}`, brand);
  }

  // Delete brand (Admin only)
  delete(id: number): Observable<BrandResponse> {
    return this.http.delete<BrandResponse>(`${this.apiUrl}/${id}`);
  }
}