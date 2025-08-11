import { ApiResponse } from '@/types/api';

// Agent Dashboard Types
export interface DashboardStats {
  totalTenants: number;
  activeCubes: number;
  todaysSales: number;
  pendingReservations: number;
  lowStockItems: number;
  openDisputes: number;
  monthlyRevenue: number;
  occupancyRate: number;
}

export interface RecentActivity {
  id: string;
  type: 'sale' | 'reservation' | 'dispute' | 'tenant_action' | 'inventory';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  status?: string;
}

// Tenant Management Types
export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  cubeAssignments: Array<{
    cubeId: string;
    cubeName: string;
    assignedDate: string;
    monthlyRent: number;
    status: 'active' | 'inactive';
  }>;
  contractDetails: {
    startDate: string;
    endDate: string;
    commissionRate: number;
    securityDeposit: number;
    monthlyRent: number;
  };
  salesSummary: {
    totalSales: number;
    monthlyAverage: number;
    lastSaleDate: string;
    topSellingItem: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Cube {
  id: string;
  name: string;
  location: string;
  size: string;
  monthlyRent: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  tenantId?: string;
  tenantName?: string;
  features: string[];
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Product & Inventory Types
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  tenantId: string;
  tenantName: string;
  cubeName: string;
  status: 'active' | 'inactive' | 'discontinued';
  images: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: string;
  performedBy: string;
  timestamp: string;
}

export interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiring';
  productId: string;
  productName: string;
  tenantName: string;
  currentStock: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

// POS & Sales Types
export interface Transaction {
  id: string;
  transactionNumber: string;
  type: 'sale' | 'return' | 'exchange';
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    tenantId: string;
  }>;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'digital' | 'store_credit';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  processedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailySummary {
  date: string;
  totalSales: number;
  totalTransactions: number;
  averageTransaction: number;
  topSellingProduct: {
    name: string;
    quantity: number;
    revenue: number;
  };
  paymentMethods: {
    cash: number;
    card: number;
    digital: number;
    store_credit: number;
  };
}

// Reports & Analytics Types
export interface SalesReport {
  period: string;
  totalRevenue: number;
  totalTransactions: number;
  averageTransactionValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
  topTenants: Array<{
    tenantId: string;
    tenantName: string;
    revenue: number;
    transactions: number;
  }>;
  dailyBreakdown: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
}

export interface InventoryReport {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categoryBreakdown: Array<{
    category: string;
    productCount: number;
    totalValue: number;
  }>;
  tenantBreakdown: Array<{
    tenantId: string;
    tenantName: string;
    productCount: number;
    totalValue: number;
  }>;
}

export interface TenantReport {
  totalTenants: number;
  activeTenants: number;
  occupancyRate: number;
  averageRent: number;
  totalRentCollected: number;
  tenantPerformance: Array<{
    tenantId: string;
    tenantName: string;
    cubeCount: number;
    monthlyRent: number;
    salesRevenue: number;
    commissionEarned: number;
  }>;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'system' | 'sales' | 'inventory' | 'tenant' | 'dispute' | 'reservation';
  title: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

// Agent Portal Service Class
class AgentPortalService {
  private baseUrl = '/api/agent-portal';

  // Dashboard Methods
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/stats`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getRecentActivity(limit: number = 10): Promise<ApiResponse<RecentActivity[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/activity?limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  // Tenant Management Methods
  async getTenants(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<{ tenants: Tenant[]; total: number; page: number; limit: number }>> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`${this.baseUrl}/tenants?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching tenants:', error);
      throw error;
    }
  }

  async getTenant(id: string): Promise<ApiResponse<Tenant>> {
    try {
      const response = await fetch(`${this.baseUrl}/tenants/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching tenant:', error);
      throw error;
    }
  }

  async createTenant(tenantData: Partial<Tenant>): Promise<ApiResponse<Tenant>> {
    try {
      const response = await fetch(`${this.baseUrl}/tenants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tenantData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  }

  async updateTenant(id: string, tenantData: Partial<Tenant>): Promise<ApiResponse<Tenant>> {
    try {
      const response = await fetch(`${this.baseUrl}/tenants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tenantData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating tenant:', error);
      throw error;
    }
  }

  async deleteTenant(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/tenants/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting tenant:', error);
      throw error;
    }
  }

  // Cube Management Methods
  async getCubes(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    location?: string;
  }): Promise<ApiResponse<{ cubes: Cube[]; total: number; page: number; limit: number }>> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`${this.baseUrl}/cubes?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching cubes:', error);
      throw error;
    }
  }

  async assignCubeToTenant(cubeId: string, tenantId: string, rentAmount: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/cubes/${cubeId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tenantId, rentAmount }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error assigning cube:', error);
      throw error;
    }
  }

  // Product & Inventory Methods
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    tenantId?: string;
    status?: string;
    lowStock?: boolean;
  }): Promise<ApiResponse<{ products: Product[]; total: number; page: number; limit: number }>> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`${this.baseUrl}/products?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getStockMovements(productId?: string, limit: number = 50): Promise<ApiResponse<StockMovement[]>> {
    try {
      const queryParams = new URLSearchParams({ limit: limit.toString() });
      if (productId) {
        queryParams.append('productId', productId);
      }
      
      const response = await fetch(`${this.baseUrl}/inventory/movements?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching stock movements:', error);
      throw error;
    }
  }

  async getInventoryAlerts(): Promise<ApiResponse<InventoryAlert[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/inventory/alerts`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory alerts:', error);
      throw error;
    }
  }

  async adjustStock(productId: string, quantity: number, reason: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/inventory/adjust`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity, reason }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error adjusting stock:', error);
      throw error;
    }
  }

  // POS & Sales Methods
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    tenantId?: string;
  }): Promise<ApiResponse<{ transactions: Transaction[]; total: number; page: number; limit: number }>> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`${this.baseUrl}/transactions?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async getDailySummary(date?: string): Promise<ApiResponse<DailySummary>> {
    try {
      const queryParams = date ? `?date=${date}` : '';
      const response = await fetch(`${this.baseUrl}/pos/daily-summary${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching daily summary:', error);
      throw error;
    }
  }

  async processTransaction(transactionData: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
    try {
      const response = await fetch(`${this.baseUrl}/pos/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error processing transaction:', error);
      throw error;
    }
  }

  // Reports & Analytics Methods
  async getSalesReport(params: {
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
    startDate?: string;
    endDate?: string;
    tenantId?: string;
  }): Promise<ApiResponse<SalesReport>> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await fetch(`${this.baseUrl}/reports/sales?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching sales report:', error);
      throw error;
    }
  }

  async getInventoryReport(): Promise<ApiResponse<InventoryReport>> {
    try {
      const response = await fetch(`${this.baseUrl}/reports/inventory`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory report:', error);
      throw error;
    }
  }

  async getTenantReport(): Promise<ApiResponse<TenantReport>> {
    try {
      const response = await fetch(`${this.baseUrl}/reports/tenants`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching tenant report:', error);
      throw error;
    }
  }

  async exportReport(type: 'sales' | 'inventory' | 'tenants', format: 'csv' | 'pdf', params?: any): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams({ format });
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`${this.baseUrl}/reports/${type}/export?${queryParams}`);
      return await response.blob();
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }

  // Notification Methods
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    category?: string;
    isRead?: boolean;
    priority?: string;
  }): Promise<ApiResponse<{ notifications: Notification[]; total: number; unreadCount: number }>> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`${this.baseUrl}/notifications?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${id}/read`, {
        method: 'PUT',
      });
      return await response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/read-all`, {
        method: 'PUT',
      });
      return await response.json();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Utility Methods
  async searchProducts(query: string, limit: number = 10): Promise<ApiResponse<Product[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/search/products?q=${encodeURIComponent(query)}&limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  async searchTenants(query: string, limit: number = 10): Promise<ApiResponse<Tenant[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/search/tenants?q=${encodeURIComponent(query)}&limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Error searching tenants:', error);
      throw error;
    }
  }

  async getSystemHealth(): Promise<ApiResponse<{
    status: 'healthy' | 'warning' | 'error';
    uptime: number;
    version: string;
    lastBackup: string;
    activeUsers: number;
    systemLoad: number;
  }>> {
    try {
      const response = await fetch(`${this.baseUrl}/system/health`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const agentPortalService = new AgentPortalService();
export default agentPortalService;

// Export types for use in components
export type {
  DashboardStats,
  RecentActivity,
  Tenant,
  Cube,
  Product,
  StockMovement,
  InventoryAlert,
  Transaction,
  DailySummary,
  SalesReport,
  InventoryReport,
  TenantReport,
  Notification,
};