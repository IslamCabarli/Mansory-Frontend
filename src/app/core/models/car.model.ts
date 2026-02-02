import { Brand } from './brand.model';

export interface Car {
  id: number;
  brand_id: number;
  brand?: Brand;
  name: string;
  slug: string;
  description?: string;
  status: 'available' | 'sold' | 'reserved';
  registration_year?: string;
  mileage?: number;
  body_type?: string;
  engine?: string;
  fuel_type?: string;
  transmission?: string;
  power_hp?: number;
  power_kw?: number;
  v_max?: number;
  acceleration?: string;
  price?: number;
  currency?: string;
  color_exterior?: string;
  color_interior?: string;
  doors?: number;
  seats?: number;
  vin?: string;
  meta_title?: string;
  meta_description?: string;
  is_featured: boolean;
  view_count: number;
  images?: CarImage[];
  specifications?: CarSpecification[];
  primary_image?: CarImage;
  formatted_price?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CarImage {
  id: number;
  car_id: number;
  image_path: string;
  image_url?: string;
  full_image_url?: string;
  image_type: 'main' | 'gallery' | 'interior' | 'exterior';
  sort_order: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CarSpecification {
  id: number;
  car_id: number;
  spec_key: string;
  spec_label: string;
  spec_value: string;
  spec_unit?: string;
  spec_category?: string;
  formatted_value?: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CarResponse {
  success: boolean;
  data: Car | PaginatedCars;
  message?: string;
}

export interface PaginatedCars {
  current_page: number;
  data: Car[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url?: string;
  path: string;
  per_page: number;
  prev_page_url?: string;
  to: number;
  total: number;
}

export interface CarFilters {
  brand_id?: number;
  status?: string;
  is_featured?: boolean;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}