// Admin Product Service for managing product approvals and filtering

export interface ProductVariant {
  id: string;
  productId: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductLog {
  id: string;
  productId: string;
  productVariantId?: string | null;
  userId: string;
  changeType: string;
  previousValue: string | null;
  newValue: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface Tenant {
  id: string;
  businessName: string;
}

export interface AdminProduct {
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
  tenant: Tenant;
  variants?: ProductVariant[];
  logs?: ProductLog[];
  imageUrl?: string;
}

export interface ProductApprovalRequest {
  approve: string; // "true" or "false"
}

class AdminProductService {
  private getAuthHeaders() {
    const token = localStorage.getItem('cornven_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getProducts(tenantId?: string): Promise<AdminProduct[]> {
    try {
      const queryParams = new URLSearchParams();
      if (tenantId) {
        queryParams.append('tenantId', tenantId);
      }
      
      const url = `/api/admin/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch products');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // Return mock data for testing when API is not available
      const mockProducts: AdminProduct[] = [
        
      ];
      
      // Filter by tenantId if provided
      if (tenantId) {
        return mockProducts.filter(product => product.tenantId === tenantId);
      }
      
      return mockProducts;
    }
  }

  async approveProduct(productId: string, approve: boolean): Promise<AdminProduct> {
    try {
      const response = await fetch(`/api/admin/products/${productId}/approve`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          approve: approve.toString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product approval');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating product approval:', error);
      throw error;
    }
  }

  async rejectProduct(productId: string): Promise<AdminProduct> {
    return this.approveProduct(productId, false);
  }

  async getAllProducts(): Promise<AdminProduct[]> {
    return this.getProducts();
  }
}

export const adminProductService = new AdminProductService();