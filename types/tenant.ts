export interface RentPayment {
  id: string;
  amount: number;
  method: 'Bank Transfer' | 'Card';
  date: string;
  tenantId: string;
  status?: 'completed' | 'pending' | 'failed';
  notes?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  businessName: string;
  contactNumber: string;
  cubeId: string;
  leaseStartDate: string;
  leaseEndDate: string;
  status: 'Upcoming' | 'Active' | 'Expired';
  rentPayments: RentPayment[];
  phone?: string;
  businessType?: string;
  monthlyRent?: number;
  securityDeposit?: number;
}

export type LeaseStatus = 'Upcoming' | 'Active' | 'Expired';

export interface TenantFormData {
  name: string;
  email: string;
  password: string;
  businessName: string;
  contactNumber: string;
  address: string;
  notes?: string;
  cubeId: string;
  leaseStartDate: string;
  leaseEndDate: string;
}