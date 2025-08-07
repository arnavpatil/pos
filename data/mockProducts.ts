import { Product, Category, InventoryChange, LowStockAlert, DeliveryLog } from '@/types/product';

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
    sku: 'SAC-STK-001',
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
    weight: 0.05,
    tags: ['cute', 'cats', 'stickers', 'pack'],
  },
  {
    id: 'prod-2',
    sku: 'MC-WC-002',
    barcode: 'CRV002001',
    name: 'Watercolor Landscape Print',
    price: 24.99,
    stock: 8,
    category: 'Prints',
    tenantId: 'tenant-2',
    tenantName: 'Mike\'s Canvas',
    description: 'Beautiful watercolor landscape print on premium paper',
    status: 'active',
    commissionRate: 20,
    deliveryMethod: 'consignment',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    createdBy: 'tenant-2',
    lowStockThreshold: 5,
    weight: 0.2,
    dimensions: { length: 30, width: 20, height: 0.1 },
    tags: ['watercolor', 'landscape', 'print', 'art'],
  },
  {
    id: 'prod-3',
    sku: 'EJ-JWL-003',
    barcode: 'CRV003001',
    name: 'Handmade Silver Earrings',
    price: 45.00,
    stock: 12,
    category: 'Jewelry',
    tenantId: 'tenant-3',
    tenantName: 'Emma\'s Jewelry',
    description: 'Elegant handcrafted silver earrings with gemstone accents',
    status: 'active',
    commissionRate: 25,
    deliveryMethod: 'handover',
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-01-22T13:20:00Z',
    createdBy: 'tenant-3',
    lowStockThreshold: 3,
    weight: 0.015,
    dimensions: { length: 3, width: 1.5, height: 0.5 },
    tags: ['handmade', 'silver', 'earrings', 'jewelry', 'gemstone'],
  },
  {
    id: 'prod-4',
    sku: 'SAC-STK-004',
    barcode: 'CRV001002',
    name: 'Dog Lover Sticker Set',
    price: 7.50,
    stock: 18,
    category: 'Stickers',
    tenantId: 'tenant-1',
    tenantName: 'Sarah\'s Art Corner',
    description: 'Collection of 15 dog-themed stickers for pet lovers',
    status: 'active',
    commissionRate: 15,
    deliveryMethod: 'handover',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-21T10:15:00Z',
    createdBy: 'tenant-1',
    lowStockThreshold: 8,
    weight: 0.08,
    tags: ['dogs', 'pets', 'stickers', 'collection'],
  },
  {
    id: 'prod-5',
    sku: 'MC-ACR-005',
    barcode: 'CRV002002',
    name: 'Abstract Acrylic Painting',
    price: 89.99,
    stock: 3,
    category: 'Paintings',
    tenantId: 'tenant-2',
    tenantName: 'Mike\'s Canvas',
    description: 'Original abstract acrylic painting on canvas',
    status: 'active',
    commissionRate: 30,
    deliveryMethod: 'consignment',
    createdAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-19T12:30:00Z',
    createdBy: 'tenant-2',
    lowStockThreshold: 2,
    weight: 1.2,
    dimensions: { length: 40, width: 30, height: 2 },
    tags: ['abstract', 'acrylic', 'painting', 'original', 'canvas'],
  },
  {
    id: 'prod-6',
    sku: 'EJ-NCK-006',
    barcode: 'CRV003002',
    name: 'Vintage Style Necklace',
    price: 32.50,
    stock: 7,
    category: 'Jewelry',
    tenantId: 'tenant-3',
    tenantName: 'Emma\'s Jewelry',
    description: 'Vintage-inspired necklace with antique brass finish',
    status: 'active',
    commissionRate: 25,
    deliveryMethod: 'handover',
    createdAt: '2024-01-14T13:10:00Z',
    updatedAt: '2024-01-23T15:40:00Z',
    createdBy: 'tenant-3',
    lowStockThreshold: 4,
    weight: 0.08,
    dimensions: { length: 45, width: 2, height: 0.3 },
    tags: ['vintage', 'necklace', 'brass', 'antique'],
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
    sku: 'LJ-EAR-007',
    weight: 0.02,
    dimensions: { length: 3, width: 1, height: 0.5 },
    tags: ['crystal', 'earrings', 'elegant', 'drop'],
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
    sku: 'OC-STI-008',
    weight: 0.01,
    dimensions: { length: 15, width: 10, height: 0.1 },
    tags: ['kawaii', 'stickers', 'anime', 'cute'],
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
    productId: 'prod-5',
    productName: 'Abstract Acrylic Painting',
    currentStock: 3,
    threshold: 5,
    tenantId: 'tenant-2',
    tenantName: 'Mike\'s Canvas',
    createdAt: '2024-01-22T09:00:00Z',
    acknowledged: false,
  },
  {
    id: 'alert-2',
    productId: 'prod-3',
    productName: 'Handmade Silver Earrings',
    currentStock: 2,
    threshold: 3,
    tenantId: 'tenant-3',
    tenantName: 'Emma\'s Jewelry',
    createdAt: '2024-01-21T14:30:00Z',
    acknowledged: true,
  },
];

export const mockDeliveryLogs: DeliveryLog[] = [
  {
    id: 'delivery-1',
    productId: 'prod-2',
    productName: 'Watercolor Landscape Print',
    tenantId: 'tenant-2',
    tenantName: 'Mike\'s Canvas',
    deliveryMethod: 'consignment',
    quantity: 5,
    deliveryDate: '2024-01-15T10:00:00Z',
    receivedBy: 'Store Manager',
    deliveredBy: 'Mike Johnson',
    status: 'delivered',
    notes: 'All prints in excellent condition',
  },
  {
    id: 'delivery-2',
    productId: 'prod-3',
    productName: 'Handmade Silver Earrings',
    tenantId: 'tenant-3',
    tenantName: 'Emma\'s Jewelry',
    deliveryMethod: 'handover',
    quantity: 8,
    deliveryDate: '2024-01-18T14:30:00Z',
    receivedBy: 'Store Manager',
    deliveredBy: 'Emma Wilson',
    status: 'delivered',
    notes: 'Direct handover completed',
    signature: 'Emma Wilson',
  },
  {
    id: 'delivery-3',
    productId: 'prod-5',
    productName: 'Abstract Acrylic Painting',
    tenantId: 'tenant-2',
    tenantName: 'Mike\'s Canvas',
    deliveryMethod: 'consignment',
    quantity: 2,
    deliveryDate: '2024-01-25T09:00:00Z',
    receivedBy: 'Store Manager',
    deliveredBy: 'Mike Johnson',
    status: 'pending',
    notes: 'Scheduled for delivery',
  },
];

// Utility functions
export const generateBarcode = (prefix: string = 'CRV'): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const generateSKU = (tenantName: string, category: string): string => {
  const tenantCode = tenantName.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  const categoryCode = category.substring(0, 3).toUpperCase();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${tenantCode}-${categoryCode}-${random}`;
};

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => product.category === category);
};

export const getProductsByTenant = (tenantId: string): Product[] => {
  return mockProducts.filter(product => product.tenantId === tenantId);
};

export const getLowStockProducts = (threshold?: number): Product[] => {
  return mockProducts.filter(product => 
    product.stock <= (threshold || product.lowStockThreshold)
  );
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description?.toLowerCase().includes(lowercaseQuery) ||
    product.barcode.toLowerCase().includes(lowercaseQuery) ||
    product.sku.toLowerCase().includes(lowercaseQuery) ||
    product.tenantName.toLowerCase().includes(lowercaseQuery) ||
    product.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const filterProducts = (filter: any): Product[] => {
  return mockProducts.filter(product => {
    if (filter.category && product.category !== filter.category) return false;
    if (filter.tenantId && product.tenantId !== filter.tenantId) return false;
    if (filter.status && product.status !== filter.status) return false;
    if (filter.deliveryMethod && product.deliveryMethod !== filter.deliveryMethod) return false;
    if (filter.lowStock && product.stock > product.lowStockThreshold) return false;
    if (filter.search) {
      const query = filter.search.toLowerCase();
      const matches = product.name.toLowerCase().includes(query) ||
                     product.description?.toLowerCase().includes(query) ||
                     product.barcode.toLowerCase().includes(query) ||
                     product.sku.toLowerCase().includes(query) ||
                     product.tenantName.toLowerCase().includes(query) ||
                     product.tags?.some(tag => tag.toLowerCase().includes(query));
      if (!matches) return false;
    }
    return true;
  });
};

// Excel export utility
export const exportProductsToCSV = (products: Product[]): string => {
  const headers = [
    'SKU', 'Barcode', 'Name', 'Price', 'Stock', 'Category', 
    'Tenant Name', 'Description', 'Status', 'Commission Rate', 
    'Delivery Method', 'Low Stock Threshold', 'Weight', 'Tags'
  ];
  
  const csvContent = [
    headers.join(','),
    ...products.map(product => [
      product.sku,
      product.barcode,
      `"${product.name}"`,
      product.price,
      product.stock,
      product.category,
      `"${product.tenantName}"`,
      `"${product.description || ''}"`,
      product.status,
      product.commissionRate,
      product.deliveryMethod,
      product.lowStockThreshold,
      product.weight || '',
      `"${product.tags?.join(';') || ''}"`
    ].join(','))
  ].join('\n');
  
  return csvContent;
};

// Mock batch import function
export const importProductsFromCSV = (csvData: string): any => {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  const dataLines = lines.slice(1);
  
  const results = {
    success: true,
    totalRows: dataLines.length,
    successfulRows: 0,
    failedRows: 0,
    errors: [] as any[],
    importedProducts: [] as Product[]
  };
  
  dataLines.forEach((line, index) => {
    try {
      const values = line.split(',');
      if (values.length < headers.length) {
        results.errors.push({
          row: index + 2,
          field: 'general',
          message: 'Insufficient data columns'
        });
        results.failedRows++;
        return;
      }
      
      const product: Product = {
        id: `imported-${Date.now()}-${index}`,
        sku: values[0] || generateSKU('Imported', values[5] || 'General'),
        barcode: values[1] || generateBarcode(),
        name: values[2].replace(/"/g, ''),
        price: parseFloat(values[3]) || 0,
        stock: parseInt(values[4]) || 0,
        category: values[5] || 'General',
        tenantId: 'tenant-1', // Default tenant
        tenantName: values[6].replace(/"/g, '') || 'Unknown Artist',
        description: values[7].replace(/"/g, ''),
        status: (values[8] as any) || 'active',
        commissionRate: parseFloat(values[9]) || 15,
        deliveryMethod: (values[10] as any) || 'handover',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'import-system',
        lowStockThreshold: parseInt(values[11]) || 5,
        weight: parseFloat(values[12]) || undefined,
        tags: values[13] ? values[13].replace(/"/g, '').split(';') : []
      };
      
      results.importedProducts.push(product);
      results.successfulRows++;
    } catch (error) {
      results.errors.push({
        row: index + 2,
        field: 'general',
        message: 'Failed to parse row data'
      });
      results.failedRows++;
    }
  });
  
  if (results.failedRows > 0) {
    results.success = false;
  }
  
  return results;
};