import { Product, Category, InventoryChange, LowStockAlert } from '@/types/product';

// Mock categories
export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Stickers', description: 'Decorative stickers and decals', productCount: 15 },
  { id: 'cat-2', name: 'Earrings', description: 'Handmade earrings and jewelry', productCount: 12 },
  { id: 'cat-3', name: 'Keychains', description: 'Custom keychains and accessories', productCount: 8 },
  { id: 'cat-4', name: 'Prints', description: 'Art prints and posters', productCount: 10 },
  { id: 'cat-5', name: 'Pins', description: 'Enamel pins and badges', productCount: 6 },
  { id: 'cat-6', name: 'Bookmarks', description: 'Decorative bookmarks', productCount: 4 },
];

// Mock products
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    barcode: 'CRV001001',
    name: 'Cute Cat Stickers Pack',
    price: 5.99,
    stock: 25,
    category: 'Stickers',
    tenantId: 'tenant-1',
    tenantName: 'Sarah\'s Art Corner',
    description: 'Pack of 10 adorable cat-themed stickers',
    status: 'active',
    commissionRate: 15,
    deliveryMethod: 'handover',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdBy: 'tenant-1',
    lowStockThreshold: 10,
  },
  {
    id: 'prod-2',
    barcode: 'CRV001002',
    name: 'Galaxy Earrings',
    price: 12.50,
    stock: 8,
    category: 'Earrings',
    tenantId: 'tenant-2',
    tenantName: 'Luna\'s Jewelry',
    description: 'Handmade galaxy-themed drop earrings',
    status: 'active',
    commissionRate: 20,
    deliveryMethod: 'consignment',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    createdBy: 'tenant-2',
    lowStockThreshold: 5,
  },
  {
    id: 'prod-3',
    barcode: 'CRV001003',
    name: 'Anime Keychain Set',
    price: 8.99,
    stock: 3,
    category: 'Keychains',
    tenantId: 'tenant-3',
    tenantName: 'Otaku Crafts',
    description: 'Set of 3 popular anime character keychains',
    status: 'active',
    commissionRate: 18,
    deliveryMethod: 'handover',
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-01-22T13:20:00Z',
    createdBy: 'tenant-3',
    lowStockThreshold: 5,
  },
  {
    id: 'prod-4',
    barcode: 'CRV001004',
    name: 'Botanical Art Print',
    price: 15.00,
    stock: 12,
    category: 'Prints',
    tenantId: 'tenant-1',
    tenantName: 'Sarah\'s Art Corner',
    description: 'Beautiful botanical illustration print (A4)',
    status: 'active',
    commissionRate: 15,
    deliveryMethod: 'handover',
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-19T10:15:00Z',
    createdBy: 'tenant-1',
    lowStockThreshold: 8,
  },
  {
    id: 'prod-5',
    barcode: 'CRV001005',
    name: 'Holographic Pin',
    price: 6.75,
    stock: 2,
    category: 'Pins',
    tenantId: 'tenant-4',
    tenantName: 'Pixel Dreams',
    description: 'Holographic enamel pin with rainbow effect',
    status: 'active',
    commissionRate: 22,
    deliveryMethod: 'consignment',
    createdAt: '2024-01-14T16:20:00Z',
    updatedAt: '2024-01-21T12:10:00Z',
    createdBy: 'tenant-4',
    lowStockThreshold: 3,
  },
  {
    id: 'prod-6',
    barcode: 'CRV001006',
    name: 'Vintage Bookmark Set',
    price: 4.50,
    stock: 18,
    category: 'Bookmarks',
    tenantId: 'tenant-5',
    tenantName: 'Paper & Ink',
    description: 'Set of 5 vintage-style bookmarks',
    status: 'active',
    commissionRate: 12,
    deliveryMethod: 'handover',
    createdAt: '2024-01-11T08:45:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    createdBy: 'tenant-5',
    lowStockThreshold: 10,
  },
  {
    id: 'prod-7',
    barcode: 'CRV001007',
    name: 'Crystal Earrings',
    price: 18.99,
    stock: 6,
    category: 'Earrings',
    tenantId: 'tenant-2',
    tenantName: 'Luna\'s Jewelry',
    description: 'Elegant crystal drop earrings',
    status: 'active',
    commissionRate: 20,
    deliveryMethod: 'consignment',
    createdAt: '2024-01-16T13:15:00Z',
    updatedAt: '2024-01-23T09:40:00Z',
    createdBy: 'tenant-2',
    lowStockThreshold: 4,
  },
  {
    id: 'prod-8',
    barcode: 'CRV001008',
    name: 'Kawaii Sticker Sheet',
    price: 3.99,
    stock: 30,
    category: 'Stickers',
    tenantId: 'tenant-3',
    tenantName: 'Otaku Crafts',
    description: 'Large sheet of kawaii-style stickers',
    status: 'active',
    commissionRate: 18,
    deliveryMethod: 'handover',
    createdAt: '2024-01-09T12:00:00Z',
    updatedAt: '2024-01-17T14:25:00Z',
    createdBy: 'tenant-3',
    lowStockThreshold: 15,
  },
];

// Mock inventory changes
export const mockInventoryChanges: InventoryChange[] = [
  {
    id: 'inv-1',
    productId: 'prod-1',
    productName: 'Cute Cat Stickers Pack',
    changeType: 'stock_in',
    quantity: 20,
    previousStock: 5,
    newStock: 25,
    reason: 'New delivery from tenant',
    timestamp: '2024-01-20T14:30:00Z',
    userId: 'user-2',
    userName: 'Inventory Manager',
  },
  {
    id: 'inv-2',
    productId: 'prod-2',
    productName: 'Galaxy Earrings',
    changeType: 'sale',
    quantity: -2,
    previousStock: 10,
    newStock: 8,
    reason: 'Sale transaction #SAL-001',
    timestamp: '2024-01-22T16:45:00Z',
    userId: 'user-3',
    userName: 'POS Operator',
  },
  {
    id: 'inv-3',
    productId: 'prod-3',
    productName: 'Anime Keychain Set',
    changeType: 'sale',
    quantity: -2,
    previousStock: 5,
    newStock: 3,
    reason: 'Sale transaction #SAL-002',
    timestamp: '2024-01-23T11:20:00Z',
    userId: 'user-3',
    userName: 'POS Operator',
  },
  {
    id: 'inv-4',
    productId: 'prod-5',
    productName: 'Holographic Pin',
    changeType: 'sale',
    quantity: -1,
    previousStock: 3,
    newStock: 2,
    reason: 'Sale transaction #SAL-003',
    timestamp: '2024-01-23T15:10:00Z',
    userId: 'user-3',
    userName: 'POS Operator',
  },
];

// Mock low stock alerts
export const mockLowStockAlerts: LowStockAlert[] = [
  {
    id: 'alert-1',
    productId: 'prod-3',
    productName: 'Anime Keychain Set',
    currentStock: 3,
    threshold: 5,
    tenantId: 'tenant-3',
    tenantName: 'Otaku Crafts',
    createdAt: '2024-01-23T11:20:00Z',
    acknowledged: false,
  },
  {
    id: 'alert-2',
    productId: 'prod-5',
    productName: 'Holographic Pin',
    currentStock: 2,
    threshold: 3,
    tenantId: 'tenant-4',
    tenantName: 'Pixel Dreams',
    createdAt: '2024-01-23T15:10:00Z',
    acknowledged: false,
  },
];

// Utility functions
export const generateBarcode = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CRV${timestamp.slice(-6)}${random}`;
};

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => product.category === category);
};

export const getProductsByTenant = (tenantId: string): Product[] => {
  return mockProducts.filter(product => product.tenantId === tenantId);
};

export const getLowStockProducts = (): Product[] => {
  return mockProducts.filter(product => product.stock <= product.lowStockThreshold);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.barcode.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.tenantName.toLowerCase().includes(lowercaseQuery)
  );
};