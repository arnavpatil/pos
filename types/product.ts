export interface Product {
  id: string;
  barcode: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  tenantId: string;
  tenantName: string;
  description?: string;
  imageUrl?: string;
  status: 'active' | 'pending' | 'inactive';
  commissionRate: number; // Percentage
  deliveryMethod: 'handover' | 'consignment';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lowStockThreshold: number;
}

export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  imageUrl?: string;
  commissionRate: number;
  deliveryMethod: 'handover' | 'consignment';
  lowStockThreshold: number;
}

export interface InventoryChange {
  id: string;
  productId: string;
  productName: string;
  changeType: 'stock_in' | 'stock_out' | 'adjustment' | 'sale';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  productCount: number;
}

export interface LowStockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  tenantId: string;
  tenantName: string;
  createdAt: string;
  acknowledged: boolean;
}