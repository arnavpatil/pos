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
  price: number;
  stock: number;
  category: string;
}

export interface UpdateStockRequest {
  productId: string;
  stock: number;
}

class TenantPortalService {
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
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
      const token = authService.getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await this.makeRequest(
        "/tenant/products",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      return {
        success: true,
        data: response,
        message: "Product submitted for approval successfully",
      };
    } catch (error) {
      console.error("Error adding product:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to add product",
      };
    }
  }

  async updateProductStock(productId: string, stock: number): Promise<TenantProduct> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/tenant/products/${productId}/stock`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ stock }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update product stock');
    }

    return response.json();
  }
}

export const tenantPortalService = new TenantPortalService();