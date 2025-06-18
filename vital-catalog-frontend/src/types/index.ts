export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
  reference: string;
  stock: 'available' | 'out_of_stock' | 'coming_soon';
  images: string[];
  price?: number;
  createdAt: Date;
  updatedAt: Date;
  views: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface Contact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  product_id?: string;
  product_name?: string;
  created_at?: string;
  status?: 'pending' | 'contacted' | 'completed';
}

export interface ContactRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  productIds: string[];
  message: string;
  createdAt: Date;
  status: 'pending' | 'contacted' | 'completed';
}

export interface DashboardStats {
  totalProducts: number;
  totalViews: number;
  topProducts: Product[];
  recentContacts: ContactRequest[];
  categoryStats: { category: string; count: number }[];
}