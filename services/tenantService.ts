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

  async addTenant(tenantData: AddTenantRequest): Promise<AddTenantResponse> {
    return this.makeRequest<AddTenantResponse>('/admin/add-tenant', {
      method: 'POST',
      body: JSON.stringify(tenantData),
    });
  }

  async viewAllTenants(): Promise<ViewTenantsResponse[]> {
    return this.makeRequest<ViewTenantsResponse[]>('/admin/tenant-cube-allocation', {
      method: 'GET',
    });
  }

  // Helper method to generate a default password
  generateDefaultPassword(): string {
    return 'Tenant@1234';
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