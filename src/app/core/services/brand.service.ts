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

  getAll(): Observable<BrandResponse> {
    return this.http.get<BrandResponse>(this.apiUrl);
  }

  getById(id: number): Observable<BrandResponse> {
    return this.http.get<BrandResponse>(`${this.apiUrl}/${id}`);
  }


  create(brandData: any): Observable<BrandResponse> {
    return this.http.post<BrandResponse>(this.apiUrl, brandData);
  }


  update(id: number, brandData: any): Observable<BrandResponse> {
    return this.http.put<BrandResponse>(`${this.apiUrl}/${id}`, brandData);
  }

  delete(id: number): Observable<BrandResponse> {
    return this.http.delete<BrandResponse>(`${this.apiUrl}/${id}`);
  }
}