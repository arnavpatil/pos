import { PaymentHistoryResponse } from '../types/payment';

class AdminPaymentService {
  private baseUrl = 'https://cornven-pos-system.vercel.app';

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

  async getPaymentHistory(rentalId: string): Promise<PaymentHistoryResponse> {
    const headers = this.getAuthHeaders();
    
    const response = await fetch(`https://cornven-pos-system.vercel.app/admin/rentals/${rentalId}/payments`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment history');
    }

    return response.json();
  }

  async recordPayment(rentalId: string, paymentData: {
    amount: number;
    method: string;
    paidAt: string;
    note?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/rentals/${rentalId}/payments`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to record payment' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  }

  async getOverdueTenants(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/rentals/overdue`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch overdue tenants' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching overdue tenants:', error);
      throw error;
    }
  }
}

export const adminPaymentService = new AdminPaymentService();