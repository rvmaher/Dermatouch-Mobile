// API Response Types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// User Types
export interface User {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Product Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  sku: string;
  stock: number;
  isActive: boolean;
  categoryId: number;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Order Types
export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  id?: number;
  productId: number;
  quantity: number;
  price: string;
  product?: {
    id: number;
    title: string;
    image: string;
  };
}

export interface Order {
  id: number;
  userId: number;
  total: string;
  currency: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  address: OrderAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: number;
    email: string;
  };
}

export interface CreateOrderRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
  address: OrderAddress;
  paymentId?: string;
}

// Query Parameters
export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  sortBy?: 'title' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  status?: string;
}

// Auth Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}