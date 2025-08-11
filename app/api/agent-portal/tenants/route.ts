import { NextRequest, NextResponse } from 'next/server';
import { TenantProfile, TenantContract, TenantFinancials } from '@/types/agentPortal';

// Mock data - In production, this would come from your database
const mockTenants: TenantProfile[] = [
  {
    id: 'tenant-001',
    personalInfo: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0123',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      dateOfBirth: '1985-06-15',
      emergencyContact: {
        name: 'John Johnson',
        phone: '+1-555-0124',
        relationship: 'Spouse',
      },
    },
    businessInfo: {
      businessName: 'Sarah\'s Handmade Jewelry',
      businessType: 'Jewelry & Accessories',
      businessDescription: 'Handcrafted jewelry with natural stones and metals',
      website: 'https://sarahsjewelry.com',
      socialMedia: {
        instagram: '@sarahs_jewelry',
        facebook: 'SarahsHandmadeJewelry',
      },
      taxId: '12-3456789',
      businessLicense: 'BL-2024-001',
    },
    status: 'active',
    joinDate: '2024-01-15',
    lastActiveDate: '2024-03-15',
    notes: 'Excellent tenant, always pays on time',
    tags: ['jewelry', 'handmade', 'premium'],
  },
  {
    id: 'tenant-002',
    personalInfo: {
      firstName: 'Mike',
      lastName: 'Chen',
      email: 'mike.chen@email.com',
      phone: '+1-555-0125',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
      },
      dateOfBirth: '1990-03-22',
    },
    businessInfo: {
      businessName: 'Tech Gadgets Plus',
      businessType: 'Electronics & Technology',
      businessDescription: 'Latest tech gadgets and accessories',
      website: 'https://techgadgetsplus.com',
      socialMedia: {
        instagram: '@techgadgetsplus',
        twitter: '@techgadgets',
      },
      taxId: '98-7654321',
      businessLicense: 'BL-2024-002',
    },
    status: 'active',
    joinDate: '2024-02-01',
    lastActiveDate: '2024-03-14',
    notes: 'High volume sales, good customer service',
    tags: ['electronics', 'technology', 'high-volume'],
  },
  {
    id: 'tenant-003',
    personalInfo: {
      firstName: 'Emma',
      lastName: 'Davis',
      email: 'emma.davis@email.com',
      phone: '+1-555-0126',
      address: {
        street: '789 Pine St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
      },
      dateOfBirth: '1988-11-08',
    },
    businessInfo: {
      businessName: 'Vintage Clothing Co',
      businessType: 'Fashion & Apparel',
      businessDescription: 'Curated vintage and retro clothing',
      website: 'https://vintageclothingco.com',
      socialMedia: {
        instagram: '@vintage_clothing_co',
        facebook: 'VintageClothingCompany',
      },
      taxId: '55-1122334',
      businessLicense: 'BL-2024-003',
    },
    status: 'suspended',
    joinDate: '2023-12-10',
    lastActiveDate: '2024-03-10',
    notes: 'Suspended due to late payments, working on resolution',
    tags: ['fashion', 'vintage', 'suspended'],
  },
];

const mockContracts: TenantContract[] = [
  {
    id: 'contract-001',
    tenantId: 'tenant-001',
    contractNumber: 'CNT-2024-001',
    type: 'monthly',
    startDate: '2024-01-15',
    endDate: '2025-01-14',
    autoRenew: true,
    terms: {
      monthlyRent: 450.00,
      securityDeposit: 900.00,
      commissionRate: 8.5,
      lateFeeRate: 5.0,
      gracePeriodDays: 5,
    },
    clauses: [
      'Tenant must maintain cube cleanliness',
      'No subletting without written permission',
      'Insurance coverage required',
      '30-day notice for termination',
    ],
    status: 'active',
    signedDate: '2024-01-15',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
  },
  {
    id: 'contract-002',
    tenantId: 'tenant-002',
    contractNumber: 'CNT-2024-002',
    type: 'quarterly',
    startDate: '2024-02-01',
    endDate: '2024-11-01',
    autoRenew: false,
    terms: {
      monthlyRent: 520.00,
      securityDeposit: 1040.00,
      commissionRate: 7.5,
      lateFeeRate: 5.0,
      gracePeriodDays: 3,
    },
    clauses: [
      'Tenant must maintain cube cleanliness',
      'No subletting without written permission',
      'Insurance coverage required',
      '60-day notice for termination',
    ],
    status: 'active',
    signedDate: '2024-02-01',
    createdAt: '2024-01-25',
    updatedAt: '2024-02-01',
  },
];

const mockFinancials: TenantFinancials[] = [
  {
    tenantId: 'tenant-001',
    currentBalance: 0.00,
    totalSales: 15420.50,
    totalCommissions: 1310.74,
    totalRentPaid: 1350.00,
    outstandingRent: 0.00,
    securityDeposit: 900.00,
    lastPaymentDate: '2024-03-01',
    nextPaymentDue: '2024-04-01',
    paymentHistory: [
      {
        id: 'pay-001',
        type: 'rent',
        amount: 450.00,
        date: '2024-03-01',
        status: 'paid',
        method: 'bank_transfer',
        reference: 'TXN-20240301-001',
        notes: 'March rent payment',
      },
      {
        id: 'pay-002',
        type: 'commission',
        amount: 245.99,
        date: '2024-02-28',
        status: 'paid',
        method: 'bank_transfer',
        reference: 'COM-20240228-001',
        notes: 'February commission payout',
      },
    ],
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('id');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get specific tenant
    if (tenantId) {
      const tenant = mockTenants.find(t => t.id === tenantId);
      if (!tenant) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'TENANT_NOT_FOUND',
              message: 'Tenant not found',
            },
          },
          { status: 404 }
        );
      }

      const contract = mockContracts.find(c => c.tenantId === tenantId);
      const financials = mockFinancials.find(f => f.tenantId === tenantId);

      return NextResponse.json({
        success: true,
        data: {
          tenant,
          contract,
          financials,
        },
      });
    }

    // Get tenant contracts
    if (type === 'contracts') {
      const contracts = tenantId 
        ? mockContracts.filter(c => c.tenantId === tenantId)
        : mockContracts;
      
      return NextResponse.json({
        success: true,
        data: contracts,
      });
    }

    // Get tenant financials
    if (type === 'financials') {
      const financials = tenantId 
        ? mockFinancials.filter(f => f.tenantId === tenantId)
        : mockFinancials;
      
      return NextResponse.json({
        success: true,
        data: financials,
      });
    }

    // Filter tenants
    let filteredTenants = mockTenants;

    if (status) {
      filteredTenants = filteredTenants.filter(t => t.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTenants = filteredTenants.filter(t => 
        t.personalInfo.firstName.toLowerCase().includes(searchLower) ||
        t.personalInfo.lastName.toLowerCase().includes(searchLower) ||
        t.personalInfo.email.toLowerCase().includes(searchLower) ||
        t.businessInfo.businessName.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTenants = filteredTenants.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedTenants,
      meta: {
        page,
        limit,
        total: filteredTenants.length,
        hasMore: endIndex < filteredTenants.length,
      },
    });
  } catch (error) {
    console.error('Tenants API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TENANTS_ERROR',
          message: 'Failed to fetch tenants data',
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
      case 'create-tenant':
        // In production, this would create a new tenant in the database
        const newTenant: TenantProfile = {
          id: `tenant-${Date.now()}`,
          ...data,
          status: 'pending',
          joinDate: new Date().toISOString().split('T')[0],
          tags: data.tags || [],
        };
        
        return NextResponse.json({
          success: true,
          data: newTenant,
          message: 'Tenant created successfully',
        });

      case 'update-tenant':
        const { tenantId, updates } = data;
        // In production, this would update the tenant in the database
        return NextResponse.json({
          success: true,
          data: { id: tenantId, ...updates },
          message: 'Tenant updated successfully',
        });

      case 'update-status':
        const { tenantId: statusTenantId, status, reason } = data;
        // In production, this would update the tenant status in the database
        return NextResponse.json({
          success: true,
          message: `Tenant status updated to ${status}`,
        });

      case 'create-contract':
        // In production, this would create a new contract in the database
        const newContract: TenantContract = {
          id: `contract-${Date.now()}`,
          contractNumber: `CNT-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
          ...data,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return NextResponse.json({
          success: true,
          data: newContract,
          message: 'Contract created successfully',
        });

      case 'record-payment':
        const { tenantId: paymentTenantId, payment } = data;
        // In production, this would record the payment in the database
        return NextResponse.json({
          success: true,
          message: 'Payment recorded successfully',
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
    console.error('Tenants POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TENANTS_POST_ERROR',
          message: 'Failed to process tenant action',
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
            message: 'Tenant ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would update the tenant in the database
    return NextResponse.json({
      success: true,
      data: { id, ...updates, updatedAt: new Date().toISOString() },
      message: 'Tenant updated successfully',
    });
  } catch (error) {
    console.error('Tenants PUT API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TENANTS_PUT_ERROR',
          message: 'Failed to update tenant',
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
    const tenantId = searchParams.get('id');

    if (!tenantId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_ID',
            message: 'Tenant ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would soft delete the tenant in the database
    return NextResponse.json({
      success: true,
      message: 'Tenant deleted successfully',
    });
  } catch (error) {
    console.error('Tenants DELETE API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TENANTS_DELETE_ERROR',
          message: 'Failed to delete tenant',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}