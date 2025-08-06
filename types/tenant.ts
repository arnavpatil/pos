export interface RentPayment {
  id: string;
  amount: number;
  method: 'Bank Transfer' | 'Card';
  date: string;
  tenantId: string;
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
}

export type LeaseStatus = 'Upcoming' | 'Active' | 'Expired';

export interface TenantFormData {
  name: string;
  email: string;
  businessName: string;
  contactNumber: string;
  cubeId: string;
  leaseStartDate: string;
  leaseEndDate: string;
}