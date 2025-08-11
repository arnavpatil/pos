// Base types for Agent Portal

// User and Authentication Types
export interface AgentUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'store_manager' | 'agent' | 'assistant';
  permissions: string[];
  avatar?: string;
  phone?: string;
  department?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPermissions {
  canManageTenants: boolean;
  canManageInventory: boolean;
  canProcessSales: boolean;
  canViewReports: boolean;
  canManageDisputes: boolean;
  canManageReservations: boolean;
  canManageCubes: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  canManageUsers: boolean;
}

// Dashboard Types
export interface DashboardMetrics {
  totalTenants: number;
  activeTenants: number;
  totalCubes: number;
  occupiedCubes: number;
  todaysSales: number;
  todaysTransactions: number;
  pendingReservations: number;
  activeDisputes: number;
  lowStockAlerts: number;
  monthlyRevenue: number;
  occupancyRate: number;
  averageTransactionValue: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  color: string;
  count?: number;
}

export interface ActivityItem {
  id: string;
  type: 'sale' | 'reservation' | 'dispute' | 'tenant_action' | 'inventory' | 'system';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  status?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  userId?: string;
  userName?: string;
}

// Tenant Management Types
export interface TenantProfile {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    dateOfBirth?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  businessInfo: {
    businessName: string;
    businessType: string;
    businessDescription: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
    taxId?: string;
    businessLicense?: string;
  };
  status: 'active' | 'inactive' | 'suspended' | 'pending' | 'terminated';
  joinDate: string;
  lastActiveDate?: string;
  notes?: string;
  tags: string[];
}

export interface TenantContract {
  id: string;
  tenantId: string;
  contractNumber: string;
  type: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  terms: {
    monthlyRent: number;
    securityDeposit: number;
    commissionRate: number;
    lateFeeRate: number;
    gracePeriodDays: number;
  };
  clauses: string[];
  status: 'active' | 'expired' | 'terminated' | 'pending';
  signedDate?: string;
  terminationDate?: string;
  terminationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantFinancials {
  tenantId: string;
  currentBalance: number;
  totalSales: number;
  totalCommissions: number;
  totalRentPaid: number;
  outstandingRent: number;
  securityDeposit: number;
  lastPaymentDate?: string;
  nextPaymentDue?: string;
  paymentHistory: Array<{
    id: string;
    type: 'rent' | 'commission' | 'deposit' | 'fee' | 'refund';
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'overdue' | 'failed';
    method: 'cash' | 'check' | 'bank_transfer' | 'card';
    reference?: string;
    notes?: string;
  }>;
}

// Cube Management Types
export interface CubeDetails {
  id: string;
  name: string;
  location: {
    section: string;
    row: string;
    position: string;
    floor?: string;
  };
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: 'inches' | 'cm';
  };
  features: {
    hasLighting: boolean;
    hasLock: boolean;
    hasGlass: boolean;
    hasMirror: boolean;
    hasShelf: boolean;
    shelfCount?: number;
    hasElectricalOutlet: boolean;
    customFeatures: string[];
  };
  condition: 'excellent' | 'good' | 'fair' | 'needs_repair';
  monthlyRent: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved' | 'out_of_service';
  tenantId?: string;
  assignedDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  maintenanceNotes?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CubeAssignment {
  id: string;
  cubeId: string;
  tenantId: string;
  assignedDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: 'active' | 'inactive' | 'terminated';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  specialTerms?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Product and Inventory Types
export interface ProductDetails {
  id: string;
  basicInfo: {
    name: string;
    description: string;
    shortDescription?: string;
    sku: string;
    barcode?: string;
    category: string;
    subcategory?: string;
    brand?: string;
    model?: string;
  };
  pricing: {
    costPrice: number;
    sellingPrice: number;
    msrp?: number;
    discountPrice?: number;
    discountStartDate?: string;
    discountEndDate?: string;
  };
  inventory: {
    currentStock: number;
    reservedStock: number;
    availableStock: number;
    minStockLevel: number;
    maxStockLevel: number;
    reorderPoint: number;
    reorderQuantity: number;
  };
  physical: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
      unit: 'inches' | 'cm';
    };
    color?: string;
    size?: string;
    material?: string;
  };
  tenantInfo: {
    tenantId: string;
    tenantName: string;
    cubeName: string;
    cubeLocation: string;
  };
  status: 'active' | 'inactive' | 'discontinued' | 'out_of_stock';
  visibility: 'public' | 'private' | 'hidden';
  images: Array<{
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
  }>;
  tags: string[];
  attributes: Record<string, any>;
  seoInfo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface StockTransaction {
  id: string;
  productId: string;
  type: 'purchase' | 'sale' | 'return' | 'adjustment' | 'transfer' | 'damage' | 'theft';
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: string;
  supplier?: {
    id: string;
    name: string;
    contact: string;
  };
  location?: {
    from?: string;
    to?: string;
  };
  performedBy: {
    id: string;
    name: string;
    role: string;
  };
  approvedBy?: {
    id: string;
    name: string;
    role: string;
  };
  notes?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  timestamp: string;
}

export interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiring' | 'damaged' | 'missing';
  severity: 'info' | 'warning' | 'error' | 'critical';
  productId: string;
  productName: string;
  sku: string;
  tenantId: string;
  tenantName: string;
  currentStock: number;
  threshold?: number;
  expectedStock?: number;
  expiryDate?: string;
  message: string;
  actionRequired: boolean;
  actionTaken?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// POS and Sales Types
export interface SaleTransaction {
  id: string;
  transactionNumber: string;
  type: 'sale' | 'return' | 'exchange' | 'void';
  status: 'pending' | 'completed' | 'cancelled' | 'refunded' | 'partially_refunded';
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    tax: number;
    totalPrice: number;
    tenantId: string;
    tenantName: string;
    commission: number;
  }>;
  customer?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    loyaltyNumber?: string;
  };
  pricing: {
    subtotal: number;
    totalDiscount: number;
    totalTax: number;
    shippingCost: number;
    total: number;
  };
  payment: {
    method: 'cash' | 'credit_card' | 'debit_card' | 'digital_wallet' | 'store_credit' | 'check' | 'split';
    status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
    amountPaid: number;
    amountDue: number;
    changeGiven?: number;
    reference?: string;
    splitPayments?: Array<{
      method: string;
      amount: number;
      reference?: string;
    }>;
  };
  processing: {
    processedBy: string;
    processedAt: string;
    terminalId?: string;
    receiptNumber: string;
    voidedBy?: string;
    voidedAt?: string;
    voidReason?: string;
  };
  shipping?: {
    method: string;
    address: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    cost: number;
  };
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'digital' | 'other';
  isActive: boolean;
  processingFee?: number;
  minimumAmount?: number;
  maximumAmount?: number;
  configuration?: Record<string, any>;
}

export interface SalesMetrics {
  period: {
    start: string;
    end: string;
    type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  };
  totals: {
    revenue: number;
    transactions: number;
    items: number;
    customers: number;
    averageTransactionValue: number;
    averageItemsPerTransaction: number;
  };
  comparisons: {
    previousPeriod: {
      revenue: number;
      transactions: number;
      revenueChange: number;
      transactionChange: number;
    };
  };
  breakdown: {
    byDay: Array<{
      date: string;
      revenue: number;
      transactions: number;
    }>;
    byTenant: Array<{
      tenantId: string;
      tenantName: string;
      revenue: number;
      transactions: number;
      commission: number;
    }>;
    byCategory: Array<{
      category: string;
      revenue: number;
      transactions: number;
      items: number;
    }>;
    byPaymentMethod: Array<{
      method: string;
      amount: number;
      count: number;
      percentage: number;
    }>;
  };
}

// Reporting and Analytics Types
export interface ReportConfig {
  id: string;
  name: string;
  type: 'sales' | 'inventory' | 'tenant' | 'financial' | 'custom';
  description: string;
  parameters: Array<{
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'select';
    label: string;
    required: boolean;
    defaultValue?: any;
    options?: Array<{ value: any; label: string }>;
  }>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    time: string;
    recipients: string[];
    format: 'pdf' | 'csv' | 'excel';
  };
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportData {
  id: string;
  configId: string;
  name: string;
  type: string;
  parameters: Record<string, any>;
  data: any;
  metadata: {
    generatedAt: string;
    generatedBy: string;
    recordCount: number;
    executionTime: number;
    dataSource: string;
  };
  format: 'json' | 'csv' | 'pdf' | 'excel';
  fileUrl?: string;
  status: 'generating' | 'completed' | 'failed';
  error?: string;
}

// Dispute and Issue Management Types
export interface DisputeCase {
  id: string;
  caseNumber: string;
  type: 'damage' | 'dispute' | 'complaint' | 'maintenance' | 'billing' | 'policy' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  status: 'open' | 'in_progress' | 'pending_review' | 'resolved' | 'closed' | 'escalated';
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  reportedBy: {
    id: string;
    name: string;
    email: string;
    role: 'tenant' | 'customer' | 'agent' | 'system';
  };
  assignedTo?: {
    id: string;
    name: string;
    department: string;
  };
  relatedEntities: Array<{
    type: 'tenant' | 'cube' | 'product' | 'transaction' | 'reservation';
    id: string;
    name: string;
  }>;
  timeline: Array<{
    id: string;
    action: string;
    description: string;
    performedBy: string;
    timestamp: string;
    isInternal: boolean;
  }>;
  attachments: Array<{
    id: string;
    name: string;
    type: 'image' | 'document' | 'video' | 'audio';
    url: string;
    size: number;
    uploadedBy: string;
    uploadedAt: string;
  }>;
  comments: Array<{
    id: string;
    author: string;
    message: string;
    timestamp: string;
    isInternal: boolean;
    attachments?: string[];
  }>;
  resolution?: {
    summary: string;
    actions: string[];
    compensation?: {
      type: 'refund' | 'credit' | 'replacement' | 'repair' | 'other';
      amount?: number;
      description: string;
    };
    resolvedBy: string;
    resolvedAt: string;
    satisfactionRating?: number;
    followUpRequired: boolean;
    followUpDate?: string;
  };
  sla: {
    responseTime: number; // in hours
    resolutionTime: number; // in hours
    responseDeadline: string;
    resolutionDeadline: string;
    isOverdue: boolean;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Reservation and Booking Types
export interface ReservationBooking {
  id: string;
  reservationNumber: string;
  type: 'pickup' | 'delivery' | 'appointment' | 'consultation' | 'installation';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
  customer: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    preferences?: Record<string, any>;
  };
  tenant: {
    id: string;
    name: string;
    businessName: string;
    cubeName: string;
    contact: string;
  };
  items: Array<{
    id: string;
    productId?: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    sku?: string;
    notes?: string;
  }>;
  scheduling: {
    requestedDate: string;
    requestedTime: string;
    confirmedDate?: string;
    confirmedTime?: string;
    duration: number; // in minutes
    timeSlot?: {
      start: string;
      end: string;
    };
    timezone: string;
  };
  location: {
    type: 'store' | 'customer_address' | 'other';
    address?: string;
    instructions?: string;
    contactPerson?: string;
    contactPhone?: string;
  };
  pricing: {
    subtotal: number;
    tax: number;
    fees: number;
    discount: number;
    total: number;
  };
  payment: {
    status: 'pending' | 'paid' | 'partially_paid' | 'refunded';
    method?: string;
    amountPaid: number;
    amountDue: number;
    dueDate?: string;
  };
  communication: {
    confirmationSent: boolean;
    reminderSent: boolean;
    followUpSent: boolean;
    lastContactDate?: string;
    preferredMethod: 'email' | 'sms' | 'phone' | 'app';
  };
  notes?: string;
  specialInstructions?: string;
  internalNotes?: string;
  tags: string[];
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  capacity: number;
  booked: number;
  available: number;
  isBlocked: boolean;
  blockReason?: string;
  tenantId?: string;
  serviceType?: string;
  pricing?: {
    basePrice: number;
    peakPricing?: number;
    discounts?: Array<{
      type: string;
      amount: number;
      condition: string;
    }>;
  };
}

// Notification and Communication Types
export interface NotificationMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder';
  category: 'system' | 'sales' | 'inventory' | 'tenant' | 'dispute' | 'reservation' | 'payment' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  details?: string;
  recipient: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  sender?: {
    id: string;
    name: string;
    type: 'user' | 'system';
  };
  channels: Array<'in_app' | 'email' | 'sms' | 'push'>;
  status: {
    sent: boolean;
    delivered: boolean;
    read: boolean;
    acknowledged: boolean;
  };
  timestamps: {
    created: string;
    sent?: string;
    delivered?: string;
    read?: string;
    acknowledged?: string;
  };
  actionRequired: boolean;
  actions?: Array<{
    id: string;
    label: string;
    type: 'button' | 'link';
    action: string;
    style: 'primary' | 'secondary' | 'danger';
  }>;
  relatedEntity?: {
    type: string;
    id: string;
    name: string;
  };
  expiresAt?: string;
  isArchived: boolean;
  tags: string[];
}

// System and Configuration Types
export interface SystemSettings {
  general: {
    storeName: string;
    storeAddress: string;
    storePhone: string;
    storeEmail: string;
    timezone: string;
    currency: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
  };
  business: {
    businessHours: Array<{
      day: string;
      isOpen: boolean;
      openTime?: string;
      closeTime?: string;
    }>;
    holidays: Array<{
      date: string;
      name: string;
      isClosed: boolean;
    }>;
    taxRates: Array<{
      name: string;
      rate: number;
      isDefault: boolean;
    }>;
  };
  pos: {
    defaultPaymentMethod: string;
    allowPartialPayments: boolean;
    requireCustomerInfo: boolean;
    printReceipts: boolean;
    emailReceipts: boolean;
    loyaltyProgram: boolean;
  };
  inventory: {
    trackStock: boolean;
    allowNegativeStock: boolean;
    lowStockThreshold: number;
    autoReorder: boolean;
    barcodeScanning: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    notificationFrequency: 'immediate' | 'hourly' | 'daily';
  };
  security: {
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
    twoFactorAuth: boolean;
    ipWhitelist: string[];
  };
}

// Export all types
export type {
  AgentUser,
  UserPermissions,
  DashboardMetrics,
  QuickAction,
  ActivityItem,
  TenantProfile,
  TenantContract,
  TenantFinancials,
  CubeDetails,
  CubeAssignment,
  ProductDetails,
  StockTransaction,
  InventoryAlert,
  SaleTransaction,
  PaymentMethod,
  SalesMetrics,
  ReportConfig,
  ReportData,
  DisputeCase,
  ReservationBooking,
  TimeSlot,
  NotificationMessage,
  SystemSettings,
};

// Common utility types
export type Status = 'active' | 'inactive' | 'pending' | 'suspended';
export type Priority = 'low' | 'medium' | 'high' | 'urgent' | 'critical';
export type UserRole = 'super_admin' | 'store_manager' | 'agent' | 'assistant';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_paid';
export type TransactionType = 'sale' | 'return' | 'exchange' | 'void';
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'reminder';
export type ReportType = 'sales' | 'inventory' | 'tenant' | 'financial' | 'custom';
export type DisputeType = 'damage' | 'dispute' | 'complaint' | 'maintenance' | 'billing' | 'policy' | 'other';
export type ReservationType = 'pickup' | 'delivery' | 'appointment' | 'consultation' | 'installation';

// API Response wrapper
export interface AgentPortalApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

// Filter and pagination types
export interface FilterOptions {
  search?: string;
  status?: string;
  type?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

// Form validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
  placeholder?: string;
  defaultValue?: any;
  options?: Array<{ value: any; label: string }>;
  validation?: ValidationRule;
  disabled?: boolean;
  hidden?: boolean;
}

// Chart and visualization types
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    title?: {
      display?: boolean;
      text?: string;
    };
  };
  scales?: {
    x?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    y?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
  };
}