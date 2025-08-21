import { authService } from './authService';

export interface TenantUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Cube {
  id: string;
  code: string;
  size: string;
  pricePerMonth: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rental {
  id: string;
  tenantId: string;
  cubeId: string;
  startDate: string;
  endDate: string;
  status: string;
  dailyRent: number;
  lastPayment: string | null;
  createdAt: string;
  updatedAt: string;
  allocatedById: string;
  cube: Cube;
}

export interface AdminTenant {
  id: string;
  userId: string;
  businessName: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  user: TenantUser;
  rentals: Rental[];
}

class AdminTenantService {
  private baseUrl = '/api';

  async getTenants(): Promise<AdminTenant[]> {
    try {
      console.log('Fetching tenants from local API:', `${this.baseUrl}/admin/tenants-allocations`);
      
      const token = authService.getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${this.baseUrl}/admin/tenants-allocations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Successfully fetched tenants:', data.length, 'items');
      return data;
    } catch (error) {
      console.error('Error fetching tenants:', error);
      throw error;
    }
  }

  async getAllTenants(): Promise<AdminTenant[]> {
    return this.getTenants();
  }
}

export const adminTenantService = new AdminTenantService();
export default adminTenantService;