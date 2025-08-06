import { Sale, SaleItem, PaymentRecord, TenantSalesReport, DashboardStats } from '@/types/sales';

// Mock sales data
export const mockSales: Sale[] = [
  {
    id: 'sale-1',
    saleNumber: 'SAL-001',
    items: [
      {
        id: 'item-1',
        productId: 'prod-2',
        productName: 'Galaxy Earrings',
        barcode: 'CRV001002',
        quantity: 2,
        unitPrice: 12.50,
        totalPrice: 25.00,
        tenantId: 'tenant-2',
        tenantName: 'Luna\'s Jewelry',
        commissionRate: 20,
        commissionAmount: 5.00,
      },
    ],
    subtotal: 25.00,
    tax: 2.50,
    total: 27.50,
    paymentMethod: 'card',
    paymentStatus: 'completed',
    cashierId: 'user-3',
    cashierName: 'POS Operator',
    timestamp: '2024-01-22T16:45:00Z',
    notes: 'Customer paid with contactless card',
  },
  {
    id: 'sale-2',
    saleNumber: 'SAL-002',
    items: [
      {
        id: 'item-2',
        productId: 'prod-3',
        productName: 'Anime Keychain Set',
        barcode: 'CRV001003',
        quantity: 1,
        unitPrice: 8.99,
        totalPrice: 8.99,
        tenantId: 'tenant-3',
        tenantName: 'Otaku Crafts',
        commissionRate: 18,
        commissionAmount: 1.62,
      },
      {
        id: 'item-3',
        productId: 'prod-1',
        productName: 'Cute Cat Stickers Pack',
        barcode: 'CRV001001',
        quantity: 1,
        unitPrice: 5.99,
        totalPrice: 5.99,
        tenantId: 'tenant-1',
        tenantName: 'Sarah\'s Art Corner',
        commissionRate: 15,
        commissionAmount: 0.90,
      },
    ],
    subtotal: 14.98,
    tax: 1.50,
    total: 16.48,
    paymentMethod: 'cash',
    paymentStatus: 'completed',
    cashierId: 'user-3',
    cashierName: 'POS Operator',
    timestamp: '2024-01-23T11:20:00Z',
    notes: 'Cash payment, change given: $3.52',
  },
  {
    id: 'sale-3',
    saleNumber: 'SAL-003',
    items: [
      {
        id: 'item-4',
        productId: 'prod-5',
        productName: 'Holographic Pin',
        barcode: 'CRV001005',
        quantity: 1,
        unitPrice: 6.75,
        totalPrice: 6.75,
        tenantId: 'tenant-4',
        tenantName: 'Pixel Dreams',
        commissionRate: 22,
        commissionAmount: 1.49,
      },
    ],
    subtotal: 6.75,
    tax: 0.68,
    total: 7.43,
    paymentMethod: 'qr',
    paymentStatus: 'completed',
    cashierId: 'user-3',
    cashierName: 'POS Operator',
    timestamp: '2024-01-23T15:10:00Z',
    notes: 'QR code payment via mobile app',
  },
];

// Mock payment records
export const mockPaymentRecords: PaymentRecord[] = [
  {
    id: 'pay-1',
    tenantId: 'tenant-1',
    tenantName: 'Sarah\'s Art Corner',
    amount: 150.00,
    type: 'rent',
    status: 'paid',
    dueDate: '2024-01-01',
    paidDate: '2024-01-01',
    paymentMethod: 'bank_transfer',
    reference: 'RENT-JAN-2024-T1',
    notes: 'January 2024 rent payment',
    createdAt: '2024-01-01T09:00:00Z',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
  },
  {
    id: 'pay-2',
    tenantId: 'tenant-2',
    tenantName: 'Luna\'s Jewelry',
    amount: 150.00,
    type: 'rent',
    status: 'paid',
    dueDate: '2024-01-01',
    paidDate: '2024-01-02',
    paymentMethod: 'online',
    reference: 'RENT-JAN-2024-T2',
    notes: 'January 2024 rent payment',
    createdAt: '2024-01-02T14:30:00Z',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
  },
  {
    id: 'pay-3',
    tenantId: 'tenant-3',
    tenantName: 'Otaku Crafts',
    amount: 150.00,
    type: 'rent',
    status: 'pending',
    dueDate: '2024-02-01',
    reference: 'RENT-FEB-2024-T3',
    notes: 'February 2024 rent payment',
    createdAt: '2024-01-15T10:00:00Z',
    startDate: '2024-02-01',
    endDate: '2024-02-29',
  },
  {
    id: 'pay-4',
    tenantId: 'tenant-1',
    tenantName: 'Sarah\'s Art Corner',
    amount: 0.90,
    type: 'commission',
    status: 'paid',
    dueDate: '2024-01-23',
    paidDate: '2024-01-23',
    paymentMethod: 'cash',
    reference: 'COM-SAL-002-T1',
    notes: 'Commission from sale SAL-002',
    createdAt: '2024-01-23T11:20:00Z',
    startDate: '2024-01-23',
  },
  {
    id: 'pay-5',
    tenantId: 'tenant-2',
    tenantName: 'Luna\'s Jewelry',
    amount: 5.00,
    type: 'commission',
    status: 'paid',
    dueDate: '2024-01-22',
    paidDate: '2024-01-22',
    paymentMethod: 'cash',
    reference: 'COM-SAL-001-T2',
    notes: 'Commission from sale SAL-001',
    createdAt: '2024-01-22T16:45:00Z',
    startDate: '2024-01-22',
  },
];

// Mock tenant sales reports
export const mockTenantSalesReports: TenantSalesReport[] = [
  {
    tenantId: 'tenant-1',
    tenantName: 'Sarah\'s Art Corner',
    period: {
      start: '2024-01-01',
      end: '2024-01-31',
    },
    totalSales: 1,
    totalCommission: 0.90,
    totalItems: 1,
    topProducts: [
      {
        productId: 'prod-1',
        productName: 'Cute Cat Stickers Pack',
        quantity: 1,
        revenue: 5.99,
      },
    ],
    salesByDay: [
      { date: '2024-01-23', sales: 1, items: 1 },
    ],
  },
  {
    tenantId: 'tenant-2',
    tenantName: 'Luna\'s Jewelry',
    period: {
      start: '2024-01-01',
      end: '2024-01-31',
    },
    totalSales: 1,
    totalCommission: 5.00,
    totalItems: 2,
    topProducts: [
      {
        productId: 'prod-2',
        productName: 'Galaxy Earrings',
        quantity: 2,
        revenue: 25.00,
      },
    ],
    salesByDay: [
      { date: '2024-01-22', sales: 1, items: 2 },
    ],
  },
];

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalSales: 3,
  totalRevenue: 51.41,
  totalCommission: 8.01,
  activeProducts: 8,
  activeTenants: 1,
  lowStockProducts: 2,
  pendingPayments: 1,
  recentSales: mockSales.slice(0, 5),
  topProducts: [
    {
      productId: 'prod-2',
      productName: 'Galaxy Earrings',
      quantity: 2,
      revenue: 25.00,
    },
    {
      productId: 'prod-1',
      productName: 'Cute Cat Stickers Pack',
      quantity: 1,
      revenue: 5.99,
    },
    {
      productId: 'prod-3',
      productName: 'Anime Keychain Set',
      quantity: 1,
      revenue: 8.99,
    },
  ],
};

// Utility functions
export const generateSaleNumber = (): string => {
  const timestamp = Date.now();
  return `SAL-${timestamp.toString().slice(-6)}`;
};

export const calculateCommission = (price: number, rate: number): number => {
  return Math.round((price * rate / 100) * 100) / 100;
};

export const getSalesByTenant = (tenantId: string): Sale[] => {
  return mockSales.filter(sale => 
    sale.items.some(item => item.tenantId === tenantId)
  );
};

export const getPaymentsByTenant = (tenantId: string): PaymentRecord[] => {
  return mockPaymentRecords.filter(payment => payment.tenantId === tenantId);
};

export const getTenantCommissionTotal = (tenantId: string): number => {
  const sales = getSalesByTenant(tenantId);
  return sales.reduce((total, sale) => {
    const tenantItems = sale.items.filter(item => item.tenantId === tenantId);
    return total + tenantItems.reduce((itemTotal, item) => itemTotal + item.commissionAmount, 0);
  }, 0);
};

export const getSalesByDateRange = (startDate: string, endDate: string): Sale[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return mockSales.filter(sale => {
    const saleDate = new Date(sale.timestamp);
    return saleDate >= start && saleDate <= end;
  });
};