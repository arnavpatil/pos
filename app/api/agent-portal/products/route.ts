import { NextRequest, NextResponse } from 'next/server';
import { ProductDetails, StockTransaction, InventoryAlert } from '@/types/agentPortal';

// Mock data - In production, this would come from your database
const mockProducts: ProductDetails[] = [
  {
    id: 'product-001',
    basicInfo: {
      name: 'Handcrafted Silver Ring',
      description: 'Beautiful handcrafted silver ring with natural turquoise stone',
      shortDescription: 'Silver ring with turquoise',
      sku: 'SJ-RING-001',
      barcode: '1234567890123',
      category: 'Jewelry',
      subcategory: 'Rings',
      brand: "Sarah's Jewelry",
      model: 'Classic Turquoise',
    },
    pricing: {
      costPrice: 45.00,
      sellingPrice: 89.99,
      msrp: 95.00,
      discountPrice: 79.99,
      discountStartDate: '2024-03-01',
      discountEndDate: '2024-03-31',
    },
    inventory: {
      currentStock: 15,
      reservedStock: 2,
      availableStock: 13,
      minStockLevel: 5,
      maxStockLevel: 50,
      reorderPoint: 8,
      reorderQuantity: 20,
    },
    physical: {
      weight: 0.5,
      dimensions: {
        length: 1.0,
        width: 1.0,
        height: 0.3,
        unit: 'inches',
      },
      color: 'Silver',
      size: 'Adjustable',
      material: 'Sterling Silver, Turquoise',
    },
    tenantInfo: {
      tenantId: 'tenant-001',
      tenantName: 'Sarah Johnson',
      cubeName: 'A-01',
      cubeLocation: 'Section A, Row 1',
    },
    status: 'active',
    visibility: 'public',
    images: [
      {
        id: 'img-001',
        url: '/images/products/ring-001-1.jpg',
        alt: 'Silver ring with turquoise - front view',
        isPrimary: true,
        order: 1,
      },
      {
        id: 'img-002',
        url: '/images/products/ring-001-2.jpg',
        alt: 'Silver ring with turquoise - side view',
        isPrimary: false,
        order: 2,
      },
    ],
    tags: ['handmade', 'silver', 'turquoise', 'adjustable', 'gift'],
    attributes: {
      metal_type: 'Sterling Silver',
      stone_type: 'Turquoise',
      ring_size: 'Adjustable',
      care_instructions: 'Clean with soft cloth, avoid chemicals',
    },
    seoInfo: {
      metaTitle: 'Handcrafted Silver Ring with Turquoise | Sarah\'s Jewelry',
      metaDescription: 'Beautiful handcrafted sterling silver ring featuring natural turquoise stone. Adjustable size, perfect gift.',
      keywords: ['silver ring', 'turquoise jewelry', 'handmade ring', 'sterling silver'],
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-01T14:30:00Z',
  },
  {
    id: 'product-002',
    basicInfo: {
      name: 'Wireless Bluetooth Earbuds',
      description: 'Premium wireless earbuds with noise cancellation and long battery life',
      shortDescription: 'Wireless earbuds with noise cancellation',
      sku: 'TG-EARBUDS-001',
      barcode: '2345678901234',
      category: 'Electronics',
      subcategory: 'Audio',
      brand: 'Tech Gadgets Plus',
      model: 'Pro Sound X1',
    },
    pricing: {
      costPrice: 65.00,
      sellingPrice: 129.99,
      msrp: 149.99,
    },
    inventory: {
      currentStock: 8,
      reservedStock: 1,
      availableStock: 7,
      minStockLevel: 3,
      maxStockLevel: 30,
      reorderPoint: 5,
      reorderQuantity: 15,
    },
    physical: {
      weight: 0.2,
      dimensions: {
        length: 3.0,
        width: 2.0,
        height: 1.5,
        unit: 'inches',
      },
      color: 'Black',
      material: 'Plastic, Silicone',
    },
    tenantInfo: {
      tenantId: 'tenant-002',
      tenantName: 'Mike Chen',
      cubeName: 'A-02',
      cubeLocation: 'Section A, Row 1',
    },
    status: 'active',
    visibility: 'public',
    images: [
      {
        id: 'img-003',
        url: '/images/products/earbuds-001-1.jpg',
        alt: 'Wireless earbuds in charging case',
        isPrimary: true,
        order: 1,
      },
    ],
    tags: ['wireless', 'bluetooth', 'earbuds', 'noise-cancellation', 'tech'],
    attributes: {
      battery_life: '24 hours with case',
      connectivity: 'Bluetooth 5.0',
      noise_cancellation: 'Active',
      water_resistance: 'IPX4',
    },
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-15T11:20:00Z',
  },
  {
    id: 'product-003',
    basicInfo: {
      name: 'Vintage Denim Jacket',
      description: 'Classic vintage denim jacket from the 1980s, excellent condition',
      shortDescription: '1980s vintage denim jacket',
      sku: 'VC-JACKET-001',
      category: 'Fashion',
      subcategory: 'Outerwear',
      brand: 'Vintage Clothing Co',
      model: 'Classic 80s',
    },
    pricing: {
      costPrice: 35.00,
      sellingPrice: 75.00,
      msrp: 85.00,
    },
    inventory: {
      currentStock: 1,
      reservedStock: 0,
      availableStock: 1,
      minStockLevel: 1,
      maxStockLevel: 5,
      reorderPoint: 1,
      reorderQuantity: 2,
    },
    physical: {
      weight: 1.5,
      dimensions: {
        length: 24.0,
        width: 20.0,
        height: 2.0,
        unit: 'inches',
      },
      color: 'Blue',
      size: 'Medium',
      material: '100% Cotton Denim',
    },
    tenantInfo: {
      tenantId: 'tenant-003',
      tenantName: 'Emma Davis',
      cubeName: 'B-01',
      cubeLocation: 'Section B, Row 1',
    },
    status: 'active',
    visibility: 'public',
    images: [
      {
        id: 'img-004',
        url: '/images/products/jacket-001-1.jpg',
        alt: 'Vintage denim jacket front view',
        isPrimary: true,
        order: 1,
      },
      {
        id: 'img-005',
        url: '/images/products/jacket-001-2.jpg',
        alt: 'Vintage denim jacket back view',
        isPrimary: false,
        order: 2,
      },
    ],
    tags: ['vintage', 'denim', 'jacket', '1980s', 'retro', 'fashion'],
    attributes: {
      era: '1980s',
      condition: 'Excellent',
      fit: 'Regular',
      care_instructions: 'Machine wash cold, hang dry',
    },
    createdAt: '2023-12-10T15:30:00Z',
    updatedAt: '2024-01-05T10:15:00Z',
  },
];

const mockStockTransactions: StockTransaction[] = [
  {
    id: 'stock-001',
    productId: 'product-001',
    type: 'purchase',
    quantity: 20,
    unitCost: 45.00,
    totalCost: 900.00,
    previousStock: 5,
    newStock: 25,
    reason: 'Initial stock purchase',
    reference: 'PO-2024-001',
    supplier: {
      id: 'supplier-001',
      name: 'Silver Craft Supplies',
      contact: 'orders@silvercraftsupplies.com',
    },
    performedBy: {
      id: 'tenant-001',
      name: 'Sarah Johnson',
      role: 'tenant',
    },
    notes: 'Bulk purchase for spring collection',
    timestamp: '2024-01-15T10:00:00Z',
  },
  {
    id: 'stock-002',
    productId: 'product-001',
    type: 'sale',
    quantity: -10,
    previousStock: 25,
    newStock: 15,
    reason: 'Customer purchases',
    performedBy: {
      id: 'system',
      name: 'POS System',
      role: 'system',
    },
    notes: 'Multiple sales transactions',
    timestamp: '2024-03-01T14:30:00Z',
  },
  {
    id: 'stock-003',
    productId: 'product-002',
    type: 'adjustment',
    quantity: -2,
    previousStock: 10,
    newStock: 8,
    reason: 'Inventory count correction',
    performedBy: {
      id: 'agent-001',
      name: 'Store Manager',
      role: 'agent',
    },
    approvedBy: {
      id: 'admin-001',
      name: 'System Admin',
      role: 'admin',
    },
    notes: 'Physical count revealed discrepancy',
    timestamp: '2024-02-15T11:20:00Z',
  },
];

const mockInventoryAlerts: InventoryAlert[] = [
  {
    id: 'alert-001',
    type: 'low_stock',
    severity: 'warning',
    productId: 'product-002',
    productName: 'Wireless Bluetooth Earbuds',
    sku: 'TG-EARBUDS-001',
    tenantId: 'tenant-002',
    tenantName: 'Mike Chen',
    currentStock: 8,
    threshold: 10,
    message: 'Stock level is below recommended threshold',
    actionRequired: true,
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-10T09:00:00Z',
  },
  {
    id: 'alert-002',
    type: 'out_of_stock',
    severity: 'critical',
    productId: 'product-004',
    productName: 'Artisan Coffee Mug',
    sku: 'AC-MUG-001',
    tenantId: 'tenant-004',
    tenantName: 'Coffee Corner',
    currentStock: 0,
    threshold: 5,
    message: 'Product is completely out of stock',
    actionRequired: true,
    createdAt: '2024-03-12T14:30:00Z',
    updatedAt: '2024-03-12T14:30:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const tenantId = searchParams.get('tenantId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const lowStock = searchParams.get('lowStock');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get specific product
    if (productId) {
      const product = mockProducts.find(p => p.id === productId);
      if (!product) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'PRODUCT_NOT_FOUND',
              message: 'Product not found',
            },
          },
          { status: 404 }
        );
      }

      const stockTransactions = mockStockTransactions.filter(t => t.productId === productId);

      return NextResponse.json({
        success: true,
        data: {
          product,
          stockTransactions,
        },
      });
    }

    // Get stock transactions
    if (type === 'stock-transactions') {
      const transactions = productId 
        ? mockStockTransactions.filter(t => t.productId === productId)
        : mockStockTransactions;
      
      return NextResponse.json({
        success: true,
        data: transactions,
      });
    }

    // Get inventory alerts
    if (type === 'alerts') {
      let alerts = mockInventoryAlerts;
      
      if (tenantId) {
        alerts = alerts.filter(a => a.tenantId === tenantId);
      }
      
      return NextResponse.json({
        success: true,
        data: alerts,
      });
    }

    // Get inventory statistics
    if (type === 'stats') {
      const stats = {
        totalProducts: mockProducts.length,
        activeProducts: mockProducts.filter(p => p.status === 'active').length,
        inactiveProducts: mockProducts.filter(p => p.status === 'inactive').length,
        lowStockProducts: mockProducts.filter(p => p.inventory.currentStock <= p.inventory.minStockLevel).length,
        outOfStockProducts: mockProducts.filter(p => p.inventory.currentStock === 0).length,
        totalStockValue: mockProducts.reduce((sum, p) => sum + (p.inventory.currentStock * p.pricing.costPrice), 0),
        totalRetailValue: mockProducts.reduce((sum, p) => sum + (p.inventory.currentStock * p.pricing.sellingPrice), 0),
        averageStockLevel: mockProducts.reduce((sum, p) => sum + p.inventory.currentStock, 0) / mockProducts.length,
        categories: [...new Set(mockProducts.map(p => p.basicInfo.category))],
        topCategories: mockProducts.reduce((acc, p) => {
          acc[p.basicInfo.category] = (acc[p.basicInfo.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };
      
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    // Filter products
    let filteredProducts = mockProducts;

    if (category) {
      filteredProducts = filteredProducts.filter(p => p.basicInfo.category === category);
    }

    if (tenantId) {
      filteredProducts = filteredProducts.filter(p => p.tenantInfo.tenantId === tenantId);
    }

    if (status) {
      filteredProducts = filteredProducts.filter(p => p.status === status);
    }

    if (lowStock === 'true') {
      filteredProducts = filteredProducts.filter(p => p.inventory.currentStock <= p.inventory.minStockLevel);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.basicInfo.name.toLowerCase().includes(searchLower) ||
        p.basicInfo.sku.toLowerCase().includes(searchLower) ||
        p.basicInfo.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      meta: {
        page,
        limit,
        total: filteredProducts.length,
        hasMore: endIndex < filteredProducts.length,
      },
    });
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PRODUCTS_ERROR',
          message: 'Failed to fetch products data',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'create-product':
        // In production, this would create a new product in the database
        const newProduct: ProductDetails = {
          id: `product-${Date.now()}`,
          ...data,
          status: 'active',
          visibility: 'public',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return NextResponse.json({
          success: true,
          data: newProduct,
          message: 'Product created successfully',
        });

      case 'update-product':
        const { productId, updates } = data;
        // In production, this would update the product in the database
        return NextResponse.json({
          success: true,
          data: { id: productId, ...updates, updatedAt: new Date().toISOString() },
          message: 'Product updated successfully',
        });

      case 'adjust-stock':
        const { productId: stockProductId, adjustment, reason, reference } = data;
        // In production, this would create a stock transaction and update inventory
        const stockTransaction: StockTransaction = {
          id: `stock-${Date.now()}`,
          productId: stockProductId,
          type: adjustment > 0 ? 'purchase' : 'adjustment',
          quantity: adjustment,
          previousStock: 0, // Would be fetched from database
          newStock: adjustment, // Would be calculated
          reason,
          reference,
          performedBy: {
            id: 'current-agent', // Would come from auth context
            name: 'Agent Name',
            role: 'agent',
          },
          timestamp: new Date().toISOString(),
        };
        
        return NextResponse.json({
          success: true,
          data: stockTransaction,
          message: 'Stock adjusted successfully',
        });

      case 'bulk-update':
        const { productIds, bulkUpdates } = data;
        // In production, this would update multiple products in the database
        return NextResponse.json({
          success: true,
          message: `${productIds.length} products updated successfully`,
        });

      case 'import-products':
        const { products } = data;
        // In production, this would bulk import products to the database
        return NextResponse.json({
          success: true,
          message: `${products.length} products imported successfully`,
        });

      case 'generate-barcode':
        const { productId: barcodeProductId } = data;
        // In production, this would generate a unique barcode
        const barcode = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
        return NextResponse.json({
          success: true,
          data: { barcode },
          message: 'Barcode generated successfully',
        });

      case 'resolve-alert':
        const { alertId, resolution } = data;
        // In production, this would update the alert status in the database
        return NextResponse.json({
          success: true,
          message: 'Alert resolved successfully',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_ACTION',
              message: 'Invalid action specified',
            },
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Products POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PRODUCTS_POST_ERROR',
          message: 'Failed to process product action',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_ID',
            message: 'Product ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would update the product in the database
    return NextResponse.json({
      success: true,
      data: { id, ...updates, updatedAt: new Date().toISOString() },
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Products PUT API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PRODUCTS_PUT_ERROR',
          message: 'Failed to update product',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_ID',
            message: 'Product ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would soft delete the product in the database
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Products DELETE API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PRODUCTS_DELETE_ERROR',
          message: 'Failed to delete product',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}