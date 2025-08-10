import { authService } from './authService';

const API_BASE_URL = '/api';

export interface AddTenantRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  businessName: string;
  address: string;
  notes?: string;
}

export interface AddTenantResponse {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  tenants: Array<{
    id: string;
    userId: string;
    businessName: string;
    address: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface ViewTenantsResponse {
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
    status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
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
      status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
      createdAt: string;
      updatedAt: string;
    };
  }>;
}

export interface CubeAllocationRequest {
  tenantId: string;
  cubeId: string;
  startDate: string;
  endDate: string;
}

export interface CubeAllocationResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class TenantService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = authService.getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
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
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use the text content
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        } catch {
          // Keep the default error message
        }
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async addTenant(tenantData: AddTenantRequest): Promise<{ success: boolean; data?: { tenantId: string }; message?: string }> {
    try {
      const response = await this.makeRequest<AddTenantResponse>('/admin/add-tenant', {
        method: 'POST',
        body: JSON.stringify(tenantData),
      });

      // Extract tenant ID from the response
      const tenantId = response.tenants?.[0]?.id;
      
      if (!tenantId) {
        throw new Error('Tenant ID not found in response');
      }

      return {
        success: true,
        data: { tenantId },
        message: 'Tenant created successfully'
      };
    } catch (error) {
      console.error('Error in addTenant:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create tenant'
      };
    }
  }

  async viewAllTenants(): Promise<ViewTenantsResponse[]> {
    return this.makeRequest<ViewTenantsResponse[]>('/admin/tenants-allocations', {
      method: 'GET',
    });
  }

  async allocateCube(allocationData: CubeAllocationRequest): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      // Format dates to ISO string
      const formattedData = {
        ...allocationData,
        startDate: new Date(allocationData.startDate).toISOString(),
        endDate: new Date(allocationData.endDate).toISOString()
      };

      const response = await this.makeRequest<CubeAllocationResponse>('/admin/tenant-cube-allocation', {
        method: 'POST',
        body: JSON.stringify(formattedData),
      });

      return {
        success: true,
        data: response,
        message: 'Cube allocated successfully'
      };
    } catch (error) {
      console.error('Error in allocateCube:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to allocate cube'
      };
    }
  }

  // Helper method to generate a default password
  generateDefaultPassword(): string {
    return 'Tenant@1234';
  }

  // Helper method to validate phone number
  validatePhoneNumber(phone: string): boolean {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Check for valid Australian phone number formats
    // Mobile: 04xxxxxxxx (10 digits starting with 04)
    // Landline: 0[2-8]xxxxxxxx (10 digits starting with 02-08)
    // International: +61xxxxxxxxx (starts with +61)
    
    if (cleaned.startsWith('61')) {
      // International format: +61xxxxxxxxx (should be 11 digits total)
      return cleaned.length === 11 && /^61[2-9]\d{8}$/.test(cleaned);
    }
    
    if (cleaned.startsWith('0')) {
      // Australian format: 0xxxxxxxxx (should be 10 digits)
      return cleaned.length === 10 && /^0[2-9]\d{8}$/.test(cleaned);
    }
    
    // If it's 9 digits, assume it's missing the leading 0
    if (cleaned.length === 9) {
      return /^[2-9]\d{8}$/.test(cleaned);
    }
    
    return false;
  }

  // Helper method to format phone number
  formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 61, it's already in international format
    if (cleaned.startsWith('61')) {
      return `+${cleaned}`;
    }
    
    // If it starts with 0, replace with +61
    if (cleaned.startsWith('0')) {
      return `+61${cleaned.substring(1)}`;
    }
    
    // If it's just the number without country code, add +61
    if (cleaned.length === 9) {
      return `+61${cleaned}`;
    }
    
    // Return as is if we can't determine the format
    return phone;
  }
}

export const tenantService = new TenantService();