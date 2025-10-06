import * as SecureStore from "expo-secure-store";
import { API_CONFIG } from "./config";
import {
  ApiResponse,
  AuthResponse,
  Category,
  CreateOrderRequest,
  LoginRequest,
  Order,
  OrdersQueryParams,
  Product,
  ProductsQueryParams,
  RegisterRequest,
  User,
} from "./types";

class ApiClient {
  private async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync("accessToken");
    } catch {
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (response.status === 401 && retryCount === 0) {
      try {
        await this.refreshToken();
        return this.request(endpoint, options, 1);
      } catch (refreshError) {
        await this.logout();
        throw new Error("Session expired. Please login again.");
      }
    }

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.data) {
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
      await SecureStore.setItemAsync(
        "refreshToken",
        response.data.refreshToken
      );
    }

    return response.data!;
  }

  async register(credentials: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.data) {
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
      await SecureStore.setItemAsync(
        "refreshToken",
        response.data.refreshToken
      );
    }

    return response.data!;
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await this.request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    if (response.data) {
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
      await SecureStore.setItemAsync(
        "refreshToken",
        response.data.refreshToken
      );
    }

    return response.data!;
  }

  async getProfile(): Promise<User> {
    const response = await this.request<User>("/auth/profile");
    return response.data!;
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  }

  async getProducts(
    params?: ProductsQueryParams
  ): Promise<{ data: Product[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.categoryId)
      searchParams.append("categoryId", params.categoryId.toString());
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const query = searchParams.toString();
    const endpoint = `/products${query ? `?${query}` : ""}`;

    const response = await this.request<Product[]>(endpoint);
    return {
      data: response.data!,
      pagination: response.pagination!,
    };
  }

  async getProduct(id: number): Promise<Product> {
    const response = await this.request<Product>(`/products/${id}`);
    return response.data!;
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.request<Category[]>("/categories");
    return response.data!;
  }

  async getCategory(id: number): Promise<Category> {
    const response = await this.request<Category>(`/categories/${id}`);
    return response.data!;
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await this.request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    return response.data!;
  }

  async getOrders(
    params?: OrdersQueryParams
  ): Promise<{ data: Order[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.status) searchParams.append("status", params.status);

    const query = searchParams.toString();
    const endpoint = `/orders${query ? `?${query}` : ""}`;

    const response = await this.request<Order[]>(endpoint);
    return {
      data: response.data!,
      pagination: response.pagination!,
    };
  }

  async getOrder(id: number): Promise<Order> {
    const response = await this.request<Order>(`/orders/${id}`);
    return response.data!;
  }
}

export const apiClient = new ApiClient();
