export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  logo_url?: string;
  is_active: boolean;
  cars_count?: number;
  created_at: string;
  updated_at: string;
}

export interface BrandResponse {
  success: boolean;
  data: Brand | Brand[];
  message?: string;
}