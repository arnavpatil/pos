import { authService } from './authService';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://cornven-pos-system.vercel.app' 
  : '/api';

export interface TenantDetails {
  id: string;
  userId: string;
  businessName: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  rentals: Array<{
    id: string;
    tenantId: string;
    cubeId: string;
    startDate: string;
    endDate: string;
    status: string;
    monthlyRent: number;
    lastPayment: string | null;
    createdAt: string;
    updatedAt: string;
    allocatedById: string;
    cube: {
      id: string;
      code: string;
      size: string;
      pricePerMonth: number;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
  }>;
}

export interface ProductVariant {
  id?: string;
  productId?: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  sku: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TenantProduct {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariant[];
  logs?: Array<{
    id: string;
    productId: string;
    userId: string;
    changeType: string;
    previousValue: string | null;
    newValue: string;
    createdAt: string;
  }>;
}

export interface AddProductRequest {
  name: string;
  description: string;
  category: string;
  sku: string;
  variants: ProductVariant[];
}

export interface UpdateStockRequest {
  productId: string;
  stock: number;
}

class TenantPortalService {
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = authService.getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getTenantDetails(): Promise<TenantDetails> {
    try {
      const token = authService.getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      return await this.makeRequest(
        "/tenant/my-details",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      throw error;
    }
  }

  async getTenantProducts(): Promise<TenantProduct[]> {
    try {
      const token = authService.getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      return await this.makeRequest(
        "/tenant/products",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error fetching tenant products:", error);
      throw error;
    }
  }

  async addProduct(productData: AddProductRequest): Promise<{ success: boolean; data?: TenantProduct; message?: string }> {
    try {
      const data = await this.makeRequest('/tenant/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      
      return { success: true, data };
    } catch (error) {
      console.error('Error adding product:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Network error occurred while adding product' 
      };
    }
  }

  async updateProductStock(productId: string, price: number, stock: number): Promise<TenantProduct> {
    const token = authService.getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/tenant/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ price, stock }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async updateVariant(productId: string, variantId: string, price: number, stock: number): Promise<ProductVariant> {
    const token = authService.getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/tenant/products/${productId}/variants/${variantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ price: price.toString(), stock: stock.toString() }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

export const tenantPortalService = new TenantPortalService();