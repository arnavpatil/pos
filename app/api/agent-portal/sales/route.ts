import { NextRequest, NextResponse } from 'next/server';
import { SaleTransaction, PaymentMethod, SalesMetrics } from '@/types/agentPortal';

// Mock data - In production, this would come from your database
const mockTransactions: SaleTransaction[] = [
  {
    id: 'txn-001',
    transactionNumber: 'TXN-2024-001234',
    type: 'sale',
    status: 'completed',
    items: [
      {
        id: 'item-001',
        productId: 'product-001',
        productName: 'Handcrafted Silver Ring',
        sku: 'SJ-RING-001',
        quantity: 1,
        unitPrice: 89.99,
        discount: 0,
        tax: 7.20,
        totalPrice: 97.19,
        tenantId: 'tenant-001',
        tenantName: 'Sarah Johnson',
        commission: 7.65,
      },
      {
        id: 'item-002',
        productId: 'product-002',
        productName: 'Wireless Bluetooth Earbuds',
        sku: 'TG-EARBUDS-001',
        quantity: 1,
        unitPrice: 129.99,
        discount: 10.00,
        tax: 9.60,
        totalPrice: 129.59,
        tenantId: 'tenant-002',
        tenantName: 'Mike Chen',
        commission: 9.75,
      },
    ],
    customer: {
      id: 'customer-001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0199',
      address: '123 Customer St, City, State 12345',
    },
    pricing: {
      subtotal: 209.98,
      totalDiscount: 10.00,
      totalTax: 16.80,
      shippingCost: 0,
      total: 216.78,
    },
    payment: {
      method: 'credit_card',
      status: 'paid',
      amountPaid: 216.78,
      amountDue: 0,
      reference: 'CC-20240315-001',
    },
    processing: {
      processedBy: 'agent-001',
      processedAt: '2024-03-15T14:30:00Z',
      terminalId: 'terminal-001',
      receiptNumber: 'RCP-2024-001234',
    },
    notes: 'Customer was very satisfied with the products',
    tags: ['walk-in', 'multiple-items'],
    createdAt: '2024-03-15T14:25:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
  },
  {
    id: 'txn-002',
    transactionNumber: 'TXN-2024-001235',
    type: 'sale',
    status: 'completed',
    items: [
      {
        id: 'item-003',
        productId: 'product-003',
        productName: 'Vintage Denim Jacket',
        sku: 'VC-JACKET-001',
        quantity: 1,
        unitPrice: 75.00,
        discount: 5.00,
        tax: 5.60,
        totalPrice: 75.60,
        tenantId: 'tenant-003',
        tenantName: 'Emma Davis',
        commission: 5.25,
      },
    ],
    customer: {
      name: 'Jane Doe',
      phone: '+1-555-0188',
    },
    pricing: {
      subtotal: 75.00,
      totalDiscount: 5.00,
      totalTax: 5.60,
      shippingCost: 0,
      total: 75.60,
    },
    payment: {
      method: 'cash',
      status: 'paid',
      amountPaid: 80.00,
      amountDue: 0,
      changeGiven: 4.40,
    },
    processing: {
      processedBy: 'agent-002',
      processedAt: '2024-03-15T16:45:00Z',
      terminalId: 'terminal-002',
      receiptNumber: 'RCP-2024-001235',
    },
    notes: 'Cash payment, customer loved the vintage style',
    tags: ['cash', 'vintage'],
    createdAt: '2024-03-15T16:40:00Z',
    updatedAt: '2024-03-15T16:45:00Z',
  },
  {
    id: 'txn-003',
    transactionNumber: 'TXN-2024-001236',
    type: 'return',
    status: 'completed',
    items: [
      {
        id: 'item-004',
        productId: 'product-001',
        productName: 'Handcrafted Silver Ring',
        sku: 'SJ-RING-001',
        quantity: -1,
        unitPrice: -89.99,
        discount: 0,
        tax: -7.20,
        totalPrice: -97.19,
        tenantId: 'tenant-001',
        tenantName: 'Sarah Johnson',
        commission: -7.65,
      },
    ],
    customer: {
      name: 'Mary Johnson',
      phone: '+1-555-0177',
    },
    pricing: {
      subtotal: -89.99,
      totalDiscount: 0,
      totalTax: -7.20,
      shippingCost: 0,
      total: -97.19,
    },
    payment: {
      method: 'credit_card',
      status: 'refunded',
      amountPaid: -97.19,
      amountDue: 0,
      reference: 'REF-20240314-001',
    },
    processing: {
      processedBy: 'agent-001',
      processedAt: '2024-03-14T11:20:00Z',
      terminalId: 'terminal-001',
      receiptNumber: 'RCP-2024-001236',
    },
    notes: 'Customer returned item due to size issue, full refund processed',
    tags: ['return', 'refund'],
    createdAt: '2024-03-14T11:15:00Z',
    updatedAt: '2024-03-14T11:20:00Z',
  },
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'payment-001',
    name: 'Cash',
    type: 'cash',
    isActive: true,
    processingFee: 0,
    minimumAmount: 0,
    maximumAmount: 1000,
  },
  {
    id: 'payment-002',
    name: 'Credit Card',
    type: 'card',
    isActive: true,
    processingFee: 2.9,
    minimumAmount: 1,
    maximumAmount: 5000,
    configuration: {
      acceptedCards: ['visa', 'mastercard', 'amex', 'discover'],
      requireSignature: true,
      requirePin: false,
    },
  },
  {
    id: 'payment-003',
    name: 'Debit Card',
    type: 'card',
    isActive: true,
    processingFee: 1.5,
    minimumAmount: 1,
    maximumAmount: 2000,
    configuration: {
      requirePin: true,
      requireSignature: false,
    },
  },
  {
    id: 'payment-004',
    name: 'Digital Wallet',
    type: 'digital',
    isActive: true,
    processingFee: 2.5,
    minimumAmount: 1,
    maximumAmount: 3000,
    configuration: {
      supportedWallets: ['apple_pay', 'google_pay', 'samsung_pay'],
      requireBiometric: true,
    },
  },
  {
    id: 'payment-005',
    name: 'Store Credit',
    type: 'other',
    isActive: true,
    processingFee: 0,
    minimumAmount: 1,
    maximumAmount: 500,
  },
];

const mockSalesMetrics: SalesMetrics = {
  period: {
    start: '2024-03-01',
    end: '2024-03-15',
    type: 'custom',
  },
  totals: {
    revenue: 15420.50,
    transactions: 89,
    items: 156,
    customers: 67,
    averageTransactionValue: 173.26,
    averageItemsPerTransaction: 1.75,
  },
  comparisons: {
    previousPeriod: {
      revenue: 12850.25,
      transactions: 76,
      revenueChange: 19.99,
      transactionChange: 17.11,
    },
  },
  breakdown: {
    byDay: [
      { date: '2024-03-01', revenue: 1250.00, transactions: 8 },
      { date: '2024-03-02', revenue: 980.50, transactions: 6 },
      { date: '2024-03-03', revenue: 1450.75, transactions: 9 },
      { date: '2024-03-04', revenue: 890.25, transactions: 5 },
      { date: '2024-03-05', revenue: 1680.00, transactions: 11 },
    ],
    byTenant: [
      {
        tenantId: 'tenant-001',
        tenantName: 'Sarah Johnson',
        revenue: 4250.00,
        transactions: 28,
        commission: 361.25,
      },
      {
        tenantId: 'tenant-002',
        tenantName: 'Mike Chen',
        revenue: 6890.50,
        transactions: 35,
        commission: 516.79,
      },
      {
        tenantId: 'tenant-003',
        tenantName: 'Emma Davis',
        revenue: 2180.00,
        transactions: 15,
        commission: 152.60,
      },
    ],
    byCategory: [
      {
        category: 'Jewelry',
        revenue: 4250.00,
        transactions: 28,
        items: 35,
      },
      {
        category: 'Electronics',
        revenue: 6890.50,
        transactions: 35,
        items: 42,
      },
      {
        category: 'Fashion',
        revenue: 2180.00,
        transactions: 15,
        items: 18,
      },
    ],
    byPaymentMethod: [
      {
        method: 'Credit Card',
        amount: 8950.25,
        count: 45,
        percentage: 58.1,
      },
      {
        method: 'Cash',
        amount: 3680.50,
        count: 28,
        percentage: 23.9,
      },
      {
        method: 'Debit Card',
        amount: 2150.75,
        count: 12,
        percentage: 13.9,
      },
      {
        method: 'Digital Wallet',
        amount: 639.00,
        count: 4,
        percentage: 4.1,
      },
    ],
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');
    const tenantId = searchParams.get('tenantId');
    const customerId = searchParams.get('customerId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get specific transaction
    if (transactionId) {
      const transaction = mockTransactions.find(t => t.id === transactionId);
      if (!transaction) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'TRANSACTION_NOT_FOUND',
              message: 'Transaction not found',
            },
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: transaction,
      });
    }

    // Get payment methods
    if (type === 'payment-methods') {
      const activeMethods = mockPaymentMethods.filter(pm => pm.isActive);
      return NextResponse.json({
        success: true,
        data: activeMethods,
      });
    }

    // Get sales metrics
    if (type === 'metrics') {
      return NextResponse.json({
        success: true,
        data: mockSalesMetrics,
      });
    }

    // Get daily summary
    if (type === 'daily-summary') {
      const today = new Date().toISOString().split('T')[0];
      const todayTransactions = mockTransactions.filter(t => 
        t.createdAt.startsWith(today) && t.status === 'completed'
      );
      
      const summary = {
        date: today,
        totalSales: todayTransactions.reduce((sum, t) => sum + t.pricing.total, 0),
        totalTransactions: todayTransactions.length,
        totalItems: todayTransactions.reduce((sum, t) => sum + t.items.length, 0),
        averageTransactionValue: todayTransactions.length > 0 
          ? todayTransactions.reduce((sum, t) => sum + t.pricing.total, 0) / todayTransactions.length 
          : 0,
        paymentBreakdown: mockPaymentMethods.map(pm => ({
          method: pm.name,
          amount: todayTransactions
            .filter(t => t.payment.method === pm.type)
            .reduce((sum, t) => sum + t.pricing.total, 0),
          count: todayTransactions.filter(t => t.payment.method === pm.type).length,
        })),
        topTenants: mockSalesMetrics.breakdown.byTenant.slice(0, 5),
      };
      
      return NextResponse.json({
        success: true,
        data: summary,
      });
    }

    // Filter transactions
    let filteredTransactions = mockTransactions;

    if (type && type !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }

    if (status) {
      filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }

    if (paymentMethod) {
      filteredTransactions = filteredTransactions.filter(t => t.payment.method === paymentMethod);
    }

    if (tenantId) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.items.some(item => item.tenantId === tenantId)
      );
    }

    if (customerId) {
      filteredTransactions = filteredTransactions.filter(t => t.customer?.id === customerId);
    }

    if (dateFrom) {
      filteredTransactions = filteredTransactions.filter(t => t.createdAt >= dateFrom);
    }

    if (dateTo) {
      filteredTransactions = filteredTransactions.filter(t => t.createdAt <= dateTo);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTransactions = filteredTransactions.filter(t => 
        t.transactionNumber.toLowerCase().includes(searchLower) ||
        t.customer?.name?.toLowerCase().includes(searchLower) ||
        t.customer?.email?.toLowerCase().includes(searchLower) ||
        t.items.some(item => 
          item.productName.toLowerCase().includes(searchLower) ||
          item.sku.toLowerCase().includes(searchLower)
        )
      );
    }

    // Sort by creation date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedTransactions,
      meta: {
        page,
        limit,
        total: filteredTransactions.length,
        hasMore: endIndex < filteredTransactions.length,
      },
    });
  } catch (error) {
    console.error('Sales API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SALES_ERROR',
          message: 'Failed to fetch sales data',
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
      case 'create-transaction':
        // In production, this would create a new transaction in the database
        const newTransaction: SaleTransaction = {
          id: `txn-${Date.now()}`,
          transactionNumber: `TXN-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
          type: 'sale',
          status: 'pending',
          ...data,
          processing: {
            processedBy: 'current-agent', // Would come from auth context
            processedAt: new Date().toISOString(),
            terminalId: 'terminal-001',
            receiptNumber: `RCP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return NextResponse.json({
          success: true,
          data: newTransaction,
          message: 'Transaction created successfully',
        });

      case 'process-payment':
        const { transactionId, paymentData } = data;
        // In production, this would process payment and update transaction
        return NextResponse.json({
          success: true,
          data: {
            transactionId,
            paymentStatus: 'paid',
            reference: `PAY-${Date.now()}`,
          },
          message: 'Payment processed successfully',
        });

      case 'process-refund':
        const { transactionId: refundTxnId, refundAmount, reason } = data;
        // In production, this would process refund and create refund transaction
        const refundTransaction: SaleTransaction = {
          id: `txn-${Date.now()}`,
          transactionNumber: `REF-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
          type: 'return',
          status: 'completed',
          items: [], // Would be populated with refunded items
          pricing: {
            subtotal: -refundAmount,
            totalDiscount: 0,
            totalTax: 0,
            shippingCost: 0,
            total: -refundAmount,
          },
          payment: {
            method: 'credit_card', // Would match original payment method
            status: 'refunded',
            amountPaid: -refundAmount,
            amountDue: 0,
            reference: `REF-${Date.now()}`,
          },
          processing: {
            processedBy: 'current-agent',
            processedAt: new Date().toISOString(),
            terminalId: 'terminal-001',
            receiptNumber: `RCP-${Date.now()}`,
          },
          notes: reason,
          tags: ['refund'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return NextResponse.json({
          success: true,
          data: refundTransaction,
          message: 'Refund processed successfully',
        });

      case 'void-transaction':
        const { transactionId: voidTxnId, voidReason } = data;
        // In production, this would void the transaction in the database
        return NextResponse.json({
          success: true,
          message: 'Transaction voided successfully',
        });

      case 'add-item':
        const { transactionId: addTxnId, item } = data;
        // In production, this would add item to existing transaction
        return NextResponse.json({
          success: true,
          data: item,
          message: 'Item added to transaction',
        });

      case 'remove-item':
        const { transactionId: removeTxnId, itemId } = data;
        // In production, this would remove item from transaction
        return NextResponse.json({
          success: true,
          message: 'Item removed from transaction',
        });

      case 'apply-discount':
        const { transactionId: discountTxnId, discount } = data;
        // In production, this would apply discount to transaction
        return NextResponse.json({
          success: true,
          data: { discount },
          message: 'Discount applied successfully',
        });

      case 'split-payment':
        const { transactionId: splitTxnId, payments } = data;
        // In production, this would handle split payment processing
        return NextResponse.json({
          success: true,
          data: { payments },
          message: 'Split payment processed successfully',
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
    console.error('Sales POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SALES_POST_ERROR',
          message: 'Failed to process sales action',
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
            message: 'Transaction ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would update the transaction in the database
    return NextResponse.json({
      success: true,
      data: { id, ...updates, updatedAt: new Date().toISOString() },
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    console.error('Sales PUT API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SALES_PUT_ERROR',
          message: 'Failed to update transaction',
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
    const transactionId = searchParams.get('id');

    if (!transactionId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_ID',
            message: 'Transaction ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would soft delete the transaction in the database
    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('Sales DELETE API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SALES_DELETE_ERROR',
          message: 'Failed to delete transaction',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}