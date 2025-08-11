import { NextRequest, NextResponse } from 'next/server';
import { SalesReport, InventoryReport, TenantReport } from '@/types/agentPortal';

// Mock data - In production, this would come from your database
const mockSalesReports: SalesReport[] = [
  {
    id: 'sales-report-001',
    period: {
      start: '2024-03-01T00:00:00Z',
      end: '2024-03-31T23:59:59Z',
      type: 'monthly',
    },
    totalSales: 45680.50,
    totalTransactions: 234,
    averageTransactionValue: 195.22,
    topProducts: [
      {
        id: 'product-001',
        name: 'Silver Necklace',
        category: 'Jewelry',
        quantitySold: 45,
        revenue: 4049.55,
        profitMargin: 35.2,
      },
      {
        id: 'product-002',
        name: 'Vintage Watch',
        category: 'Watches',
        quantitySold: 12,
        revenue: 14400.00,
        profitMargin: 42.8,
      },
      {
        id: 'product-003',
        name: 'Gold Bracelet',
        category: 'Jewelry',
        quantitySold: 28,
        revenue: 9800.00,
        profitMargin: 38.5,
      },
    ],
    salesByCategory: {
      'Jewelry': 28450.75,
      'Watches': 14400.00,
      'Accessories': 2829.75,
    },
    salesByTenant: [
      {
        tenantId: 'tenant-001',
        tenantName: 'Sarah Johnson',
        cubeName: 'A-12',
        sales: 18750.25,
        transactions: 89,
        commission: 1406.27,
        commissionRate: 7.5,
      },
      {
        tenantId: 'tenant-002',
        tenantName: 'Mike Chen',
        cubeName: 'B-23',
        sales: 15230.50,
        transactions: 67,
        commission: 1066.14,
        commissionRate: 7.0,
      },
      {
        tenantId: 'tenant-003',
        tenantName: 'Emma Davis',
        cubeName: 'C-45',
        sales: 11699.75,
        transactions: 78,
        commission: 936.98,
        commissionRate: 8.0,
      },
    ],
    dailyBreakdown: [
      { date: '2024-03-01', sales: 1250.75, transactions: 8 },
      { date: '2024-03-02', sales: 1890.50, transactions: 12 },
      { date: '2024-03-03', sales: 2150.25, transactions: 15 },
      // ... more daily data would be here
    ],
    paymentMethods: {
      'card': 38228.43,
      'cash': 5452.07,
      'digital': 2000.00,
    },
    refunds: {
      totalAmount: 450.75,
      count: 3,
      reasons: {
        'defective': 250.00,
        'customer_request': 200.75,
      },
    },
    createdAt: '2024-04-01T00:00:00Z',
    generatedBy: 'system',
  },
];

const mockInventoryReports: InventoryReport[] = [
  {
    id: 'inventory-report-001',
    period: {
      start: '2024-03-01T00:00:00Z',
      end: '2024-03-31T23:59:59Z',
      type: 'monthly',
    },
    totalProducts: 1250,
    totalValue: 125000.75,
    lowStockItems: [
      {
        productId: 'product-001',
        name: 'Silver Necklace',
        currentStock: 2,
        minimumStock: 5,
        category: 'Jewelry',
        tenantId: 'tenant-001',
        tenantName: 'Sarah Johnson',
        lastRestocked: '2024-02-15T00:00:00Z',
      },
      {
        productId: 'product-004',
        name: 'Leather Wallet',
        currentStock: 1,
        minimumStock: 3,
        category: 'Accessories',
        tenantId: 'tenant-002',
        tenantName: 'Mike Chen',
        lastRestocked: '2024-02-20T00:00:00Z',
      },
    ],
    outOfStockItems: [
      {
        productId: 'product-005',
        name: 'Diamond Ring',
        category: 'Jewelry',
        tenantId: 'tenant-003',
        tenantName: 'Emma Davis',
        lastSold: '2024-03-28T00:00:00Z',
        expectedRestock: '2024-04-05T00:00:00Z',
      },
    ],
    topMovingProducts: [
      {
        productId: 'product-001',
        name: 'Silver Necklace',
        category: 'Jewelry',
        quantitySold: 45,
        turnoverRate: 85.7,
        daysToSellOut: 12,
      },
      {
        productId: 'product-002',
        name: 'Vintage Watch',
        category: 'Watches',
        quantitySold: 12,
        turnoverRate: 75.0,
        daysToSellOut: 18,
      },
    ],
    slowMovingProducts: [
      {
        productId: 'product-006',
        name: 'Antique Brooch',
        category: 'Jewelry',
        quantitySold: 1,
        turnoverRate: 5.2,
        daysInStock: 180,
        tenantId: 'tenant-001',
        tenantName: 'Sarah Johnson',
      },
    ],
    categoryBreakdown: {
      'Jewelry': {
        totalItems: 850,
        totalValue: 85000.50,
        averageValue: 100.00,
        turnoverRate: 65.2,
      },
      'Watches': {
        totalItems: 200,
        totalValue: 30000.25,
        averageValue: 150.00,
        turnoverRate: 45.8,
      },
      'Accessories': {
        totalItems: 200,
        totalValue: 10000.00,
        averageValue: 50.00,
        turnoverRate: 72.1,
      },
    },
    stockMovements: [
      {
        date: '2024-03-15',
        type: 'restock',
        productId: 'product-001',
        productName: 'Silver Necklace',
        quantity: 20,
        reason: 'Low stock alert',
      },
      {
        date: '2024-03-20',
        type: 'sale',
        productId: 'product-002',
        productName: 'Vintage Watch',
        quantity: -1,
        reason: 'Customer purchase',
      },
    ],
    alerts: [
      {
        type: 'low_stock',
        count: 15,
        severity: 'medium',
      },
      {
        type: 'out_of_stock',
        count: 3,
        severity: 'high',
      },
      {
        type: 'slow_moving',
        count: 8,
        severity: 'low',
      },
    ],
    createdAt: '2024-04-01T00:00:00Z',
    generatedBy: 'system',
  },
];

const mockTenantReports: TenantReport[] = [
  {
    id: 'tenant-report-001',
    period: {
      start: '2024-03-01T00:00:00Z',
      end: '2024-03-31T23:59:59Z',
      type: 'monthly',
    },
    totalTenants: 25,
    activeTenants: 23,
    newTenants: 2,
    churnedTenants: 1,
    occupancyRate: 92.0,
    totalRevenue: 45680.50,
    totalCommissions: 3409.39,
    averageCommissionRate: 7.47,
    tenantPerformance: [
      {
        tenantId: 'tenant-001',
        name: 'Sarah Johnson',
        cubeName: 'A-12',
        cubeSize: 'medium',
        joinDate: '2023-08-15T00:00:00Z',
        sales: 18750.25,
        transactions: 89,
        commission: 1406.27,
        commissionRate: 7.5,
        products: 45,
        averageProductValue: 125.50,
        customerRating: 4.8,
        disputes: 0,
        paymentStatus: 'current',
        lastPayment: '2024-03-01T00:00:00Z',
        nextPaymentDue: '2024-04-01T00:00:00Z',
      },
      {
        tenantId: 'tenant-002',
        name: 'Mike Chen',
        cubeName: 'B-23',
        cubeSize: 'large',
        joinDate: '2023-06-10T00:00:00Z',
        sales: 15230.50,
        transactions: 67,
        commission: 1066.14,
        commissionRate: 7.0,
        products: 38,
        averageProductValue: 180.75,
        customerRating: 4.6,
        disputes: 1,
        paymentStatus: 'current',
        lastPayment: '2024-03-01T00:00:00Z',
        nextPaymentDue: '2024-04-01T00:00:00Z',
      },
      {
        tenantId: 'tenant-003',
        name: 'Emma Davis',
        cubeName: 'C-45',
        cubeSize: 'small',
        joinDate: '2023-09-20T00:00:00Z',
        sales: 11699.75,
        transactions: 78,
        commission: 936.98,
        commissionRate: 8.0,
        products: 32,
        averageProductValue: 95.25,
        customerRating: 4.9,
        disputes: 1,
        paymentStatus: 'overdue',
        lastPayment: '2024-02-15T00:00:00Z',
        nextPaymentDue: '2024-03-15T00:00:00Z',
      },
    ],
    cubeUtilization: {
      small: {
        total: 10,
        occupied: 9,
        vacant: 1,
        occupancyRate: 90.0,
        averageRevenue: 8500.00,
      },
      medium: {
        total: 10,
        occupied: 9,
        vacant: 1,
        occupancyRate: 90.0,
        averageRevenue: 12500.00,
      },
      large: {
        total: 5,
        occupied: 5,
        vacant: 0,
        occupancyRate: 100.0,
        averageRevenue: 18000.00,
      },
    },
    paymentAnalysis: {
      current: 22,
      overdue: 1,
      totalOutstanding: 850.00,
      averageDaysOverdue: 15,
    },
    satisfactionMetrics: {
      averageRating: 4.7,
      totalReviews: 156,
      ratingDistribution: {
        5: 89,
        4: 45,
        3: 18,
        2: 3,
        1: 1,
      },
    },
    disputes: {
      total: 2,
      resolved: 1,
      pending: 1,
      averageResolutionTime: 48, // hours
    },
    createdAt: '2024-04-01T00:00:00Z',
    generatedBy: 'system',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type');
    const reportId = searchParams.get('id');
    const period = searchParams.get('period');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const tenantId = searchParams.get('tenantId');
    const category = searchParams.get('category');
    const format = searchParams.get('format') || 'json';

    // Get specific report
    if (reportId) {
      let report = null;
      
      if (reportType === 'sales') {
        report = mockSalesReports.find(r => r.id === reportId);
      } else if (reportType === 'inventory') {
        report = mockInventoryReports.find(r => r.id === reportId);
      } else if (reportType === 'tenant') {
        report = mockTenantReports.find(r => r.id === reportId);
      }
      
      if (!report) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'REPORT_NOT_FOUND',
              message: 'Report not found',
            },
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: report,
      });
    }

    // Get dashboard summary
    if (reportType === 'dashboard') {
      const dashboardData = {
        salesSummary: {
          totalSales: 45680.50,
          totalTransactions: 234,
          averageTransactionValue: 195.22,
          growthRate: 12.5,
          topProduct: 'Silver Necklace',
        },
        inventorySummary: {
          totalProducts: 1250,
          totalValue: 125000.75,
          lowStockAlerts: 15,
          outOfStockAlerts: 3,
          turnoverRate: 65.2,
        },
        tenantSummary: {
          totalTenants: 25,
          activeTenants: 23,
          occupancyRate: 92.0,
          averageRating: 4.7,
          overduePayments: 1,
        },
        financialSummary: {
          totalRevenue: 45680.50,
          totalCommissions: 3409.39,
          netProfit: 42271.11,
          profitMargin: 92.5,
        },
        recentActivity: [
          {
            type: 'sale',
            description: 'Vintage Watch sold by Mike Chen',
            amount: 1200.00,
            timestamp: '2024-03-31T16:30:00Z',
          },
          {
            type: 'alert',
            description: 'Low stock alert for Silver Necklace',
            severity: 'medium',
            timestamp: '2024-03-31T14:15:00Z',
          },
          {
            type: 'payment',
            description: 'Commission payment processed for Sarah Johnson',
            amount: 1406.27,
            timestamp: '2024-03-31T10:00:00Z',
          },
        ],
      };
      
      return NextResponse.json({
        success: true,
        data: dashboardData,
      });
    }

    // Get available report periods
    if (reportType === 'periods') {
      const periods = [
        { value: 'today', label: 'Today', start: new Date().toISOString().split('T')[0] },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'this_week', label: 'This Week' },
        { value: 'last_week', label: 'Last Week' },
        { value: 'this_month', label: 'This Month' },
        { value: 'last_month', label: 'Last Month' },
        { value: 'this_quarter', label: 'This Quarter' },
        { value: 'last_quarter', label: 'Last Quarter' },
        { value: 'this_year', label: 'This Year' },
        { value: 'last_year', label: 'Last Year' },
        { value: 'custom', label: 'Custom Range' },
      ];
      
      return NextResponse.json({
        success: true,
        data: periods,
      });
    }

    // Get report templates
    if (reportType === 'templates') {
      const templates = {
        sales: [
          {
            id: 'sales-summary',
            name: 'Sales Summary',
            description: 'Overview of sales performance and trends',
            fields: ['totalSales', 'transactions', 'topProducts', 'salesByCategory'],
          },
          {
            id: 'sales-detailed',
            name: 'Detailed Sales Report',
            description: 'Comprehensive sales analysis with breakdowns',
            fields: ['all'],
          },
          {
            id: 'tenant-sales',
            name: 'Tenant Sales Performance',
            description: 'Sales performance by tenant',
            fields: ['salesByTenant', 'commissions'],
          },
        ],
        inventory: [
          {
            id: 'inventory-summary',
            name: 'Inventory Summary',
            description: 'Current inventory status and alerts',
            fields: ['totalProducts', 'lowStockItems', 'outOfStockItems'],
          },
          {
            id: 'inventory-movement',
            name: 'Inventory Movement',
            description: 'Product movement and turnover analysis',
            fields: ['topMovingProducts', 'slowMovingProducts', 'stockMovements'],
          },
        ],
        tenant: [
          {
            id: 'tenant-overview',
            name: 'Tenant Overview',
            description: 'General tenant statistics and performance',
            fields: ['totalTenants', 'occupancyRate', 'tenantPerformance'],
          },
          {
            id: 'tenant-financial',
            name: 'Tenant Financial Report',
            description: 'Financial performance and payment analysis',
            fields: ['totalRevenue', 'commissions', 'paymentAnalysis'],
          },
        ],
      };
      
      return NextResponse.json({
        success: true,
        data: templates,
      });
    }

    // Generate reports based on type
    let reports = [];
    
    switch (reportType) {
      case 'sales':
        reports = mockSalesReports;
        break;
      case 'inventory':
        reports = mockInventoryReports;
        break;
      case 'tenant':
        reports = mockTenantReports;
        break;
      default:
        // Return all report types
        reports = [
          ...mockSalesReports.map(r => ({ ...r, reportType: 'sales' })),
          ...mockInventoryReports.map(r => ({ ...r, reportType: 'inventory' })),
          ...mockTenantReports.map(r => ({ ...r, reportType: 'tenant' })),
        ];
    }

    // Filter by period
    if (period && period !== 'all') {
      reports = reports.filter(r => r.period.type === period);
    }

    // Filter by date range
    if (startDate && endDate) {
      reports = reports.filter(r => 
        new Date(r.period.start) >= new Date(startDate) &&
        new Date(r.period.end) <= new Date(endDate)
      );
    }

    // Filter by tenant
    if (tenantId && reportType === 'sales') {
      reports = reports.map(r => ({
        ...r,
        salesByTenant: r.salesByTenant.filter(t => t.tenantId === tenantId),
      }));
    }

    // Sort by creation date (newest first)
    reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Handle different export formats
    if (format === 'csv') {
      // In production, this would generate CSV format
      return new NextResponse('CSV export not implemented in mock', {
        status: 501,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    if (format === 'pdf') {
      // In production, this would generate PDF format
      return new NextResponse('PDF export not implemented in mock', {
        status: 501,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: reports,
      meta: {
        total: reports.length,
        reportType,
        period,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Reports API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REPORTS_ERROR',
          message: 'Failed to fetch reports data',
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
      case 'generate-report':
        const { type, period, startDate, endDate, filters, template } = data;
        
        // In production, this would generate a new report based on parameters
        const newReport = {
          id: `${type}-report-${Date.now()}`,
          type,
          period: {
            start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: endDate || new Date().toISOString(),
            type: period || 'custom',
          },
          filters,
          template,
          status: 'generating',
          progress: 0,
          createdAt: new Date().toISOString(),
          generatedBy: 'agent-001', // Would be from authenticated user
        };
        
        return NextResponse.json({
          success: true,
          data: newReport,
          message: 'Report generation started',
        });

      case 'schedule-report':
        const { reportConfig, schedule } = data;
        
        // In production, this would schedule recurring report generation
        const scheduledReport = {
          id: `scheduled-${Date.now()}`,
          ...reportConfig,
          schedule,
          nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        
        return NextResponse.json({
          success: true,
          data: scheduledReport,
          message: 'Report scheduled successfully',
        });

      case 'export-report':
        const { reportId, format: exportFormat } = data;
        
        // In production, this would export the report in the specified format
        return NextResponse.json({
          success: true,
          data: {
            downloadUrl: `/api/reports/download/${reportId}?format=${exportFormat}`,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          },
          message: `Report exported as ${exportFormat.toUpperCase()}`,
        });

      case 'share-report':
        const { reportId: shareReportId, recipients, message } = data;
        
        // In production, this would share the report with specified recipients
        return NextResponse.json({
          success: true,
          message: `Report shared with ${recipients.length} recipient(s)`,
        });

      case 'save-template':
        const { templateName, templateConfig } = data;
        
        // In production, this would save a custom report template
        const savedTemplate = {
          id: `template-${Date.now()}`,
          name: templateName,
          config: templateConfig,
          createdBy: 'agent-001',
          createdAt: new Date().toISOString(),
        };
        
        return NextResponse.json({
          success: true,
          data: savedTemplate,
          message: 'Report template saved successfully',
        });

      case 'get-insights':
        const { reportType: insightType, timeframe } = data;
        
        // In production, this would generate AI-powered insights
        const insights = {
          trends: [
            {
              type: 'positive',
              title: 'Sales Growth',
              description: 'Sales have increased by 12.5% compared to last month',
              impact: 'high',
            },
            {
              type: 'warning',
              title: 'Inventory Concerns',
              description: '15 products are running low on stock',
              impact: 'medium',
            },
          ],
          recommendations: [
            {
              title: 'Optimize Inventory',
              description: 'Consider restocking high-performing products',
              priority: 'high',
              estimatedImpact: 'Potential 8% revenue increase',
            },
            {
              title: 'Tenant Engagement',
              description: 'Reach out to underperforming tenants for support',
              priority: 'medium',
              estimatedImpact: 'Improved tenant satisfaction',
            },
          ],
          predictions: {
            nextMonthSales: 52000,
            confidence: 85,
            factors: ['seasonal trends', 'historical performance', 'current inventory'],
          },
        };
        
        return NextResponse.json({
          success: true,
          data: insights,
          message: 'Insights generated successfully',
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
    console.error('Reports POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REPORTS_POST_ERROR',
          message: 'Failed to process report action',
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
            message: 'Report ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would update the report in the database
    return NextResponse.json({
      success: true,
      data: { id, ...updates, updatedAt: new Date().toISOString() },
      message: 'Report updated successfully',
    });
  } catch (error) {
    console.error('Reports PUT API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REPORTS_PUT_ERROR',
          message: 'Failed to update report',
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
    const reportId = searchParams.get('id');

    if (!reportId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_ID',
            message: 'Report ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would delete the report from the database
    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    console.error('Reports DELETE API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REPORTS_DELETE_ERROR',
          message: 'Failed to delete report',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}