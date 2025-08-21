import { Tenant, RentPayment } from '@/types/tenant';

export const mockRentPayments: RentPayment[] = [
  {
    id: 'payment-1',
    amount: 200,
    method: 'Bank Transfer',
    date: '2024-08-01',
    tenantId: 'tenant-1',
    status: 'completed',
    notes: 'Daily Rent payment'
  },
  {
    id: 'payment-2',
    amount: 200,
    method: 'Bank Transfer',
    date: '2024-09-01',
    tenantId: 'tenant-1',
    status: 'completed',
    notes: 'Daily Rent payment'
  },
  {
    id: 'payment-3',
    amount: 150,
    method: 'Card',
    date: '2024-10-01',
    tenantId: 'tenant-1',
    status: 'pending',
    notes: 'Partial payment received'
  }
];

export const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Alice Smith',
    email: 'alice.smith@email.com',
    businessName: 'Alice\'s Artworks',
    phone: '+61 400 123 456',
    businessType: 'Visual Arts',
    cubeId: 'C1',
    leaseStartDate: '2024-08-01',
    leaseEndDate: '2026-01-31',
    status: 'Active',
    dailyRent: 200,
    securityDeposit: 400,
    rentPayments: mockRentPayments.filter(payment => payment.tenantId === 'tenant-1')
  },
  {
    id: 'tenant-2',
    name: 'Bob Lee',
    email: 'bob.lee@email.com',
    businessName: 'Bob\'s Handcrafts',
    phone: '+61 400 789 012',
    businessType: 'Handcrafts',
    cubeId: 'C3',
    leaseStartDate: '2025-02-01',
    leaseEndDate: '2025-07-31',
    status: 'Upcoming',
    dailyRent: 180,
    securityDeposit: 360,
    rentPayments: []
  },
  {
    id: 'tenant-3',
    name: 'Carol Johnson',
    email: 'carol.johnson@email.com',
    businessName: 'Carol\'s Ceramics',
    phone: '+61 400 345 678',
    businessType: 'Ceramics',
    cubeId: 'C2',
    leaseStartDate: '2023-06-01',
    leaseEndDate: '2024-05-31',
    status: 'Expired',
    dailyRent: 180,
    securityDeposit: 360,
    rentPayments: [
      {
        id: 'payment-4',
        amount: 180,
        method: 'Card',
        date: '2023-06-01',
        tenantId: 'tenant-3',
        status: 'completed',
        notes: 'First month rent'
      },
      {
        id: 'payment-5',
        amount: 180,
        method: 'Bank Transfer',
        date: '2023-07-01',
        tenantId: 'tenant-3',
        status: 'completed',
        notes: 'Daily Rent payment'
      }
    ]
  }
];

export const availableCubes = ['C1', 'C2', 'C3', 'C4', 'C5'];

// Utility function to calculate lease status based on dates
export const calculateLeaseStatus = (startDate: string, endDate: string): 'Upcoming' | 'Active' | 'Expired' => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (today < start) {
    return 'Upcoming';
  } else if (today >= start && today <= end) {
    return 'Active';
  } else {
    return 'Expired';
  }
};