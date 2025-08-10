import { NextRequest, NextResponse } from 'next/server';
import { mockCubes } from '../../../../data/mockCubes';
import { storedTenants } from '../../../../data/mockTenants';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header missing' },
        { status: 401 }
      );
    }

    // Get allocations from the allocation API
    const allocationsResponse = await fetch(`${request.nextUrl.origin}/api/admin/tenant-cube-allocation`, {
      headers: { 'Authorization': authHeader }
    });
    
    let allocations: any[] = [];
    if (allocationsResponse.ok) {
      allocations = await allocationsResponse.json();
    }

    // Merge tenants with their allocations and cube data
    const tenantsWithRentals = storedTenants.map(tenant => {
      const tenantAllocations = allocations.filter(allocation => allocation.tenantId === tenant.id);
      
      const rentals = tenantAllocations.map(allocation => {
        const cube = mockCubes.find(c => c.id === allocation.cubeId);
        return {
          ...allocation,
          cube: cube ? {
            id: cube.id,
            code: cube.code,
            size: cube.size,
            pricePerMonth: cube.pricePerMonth,
            status: cube.status,
            createdAt: cube.createdAt,
            updatedAt: cube.updatedAt
          } : null
        };
      });

      return {
        ...tenant,
        rentals
      };
    });

    // Add some default mock tenants if no tenants exist
    if (storedTenants.length === 0) {
      const mockTenants = [
        {
          id: "75ca9c9d-b60e-48b3-b6de-b186e098f2f6",
          userId: "f1860cea-42bc-4be3-8f2f-e443423c2e69",
          businessName: "Alice's Art Studio",
          address: "50 Gallery Rd, Melbourne VIC",
          notes: "VIP tenant",
          createdAt: "2025-08-06T14:28:47.106Z",
          updatedAt: "2025-08-06T14:28:47.106Z",
          user: {
            id: "f1860cea-42bc-4be3-8f2f-e443423c2e69",
            name: "John",
            email: "tenant1@example.com",
            phone: "0400123456"
          },
          rentals: [
            {
              id: "50a2e80c-7169-491b-aa4f-74d898eeb878",
              tenantId: "75ca9c9d-b60e-48b3-b6de-b186e098f2f6",
              cubeId: "21a057be-058c-4463-a6d1-ad793a148362",
              startDate: "2025-08-05T00:00:00.000Z",
              endDate: "2026-09-05T00:00:00.000Z",
              status: "ACTIVE",
              monthlyRent: 200,
              lastPayment: null,
              createdAt: "2025-08-06T14:32:04.281Z",
              updatedAt: "2025-08-06T14:32:04.281Z",
              allocatedById: "b28b878a-7f65-4ef2-8367-a907d38a6db9",
              cube: {
                id: "21a057be-058c-4463-a6d1-ad793a148362",
                code: "A1",
                size: "Small",
                pricePerMonth: 200,
                status: "RENTED",
                createdAt: "2025-08-07T00:27:19.062Z",
                updatedAt: "2025-08-06T14:32:04.787Z"
              }
            }
          ]
        }
      ];
      return NextResponse.json(mockTenants, { status: 200 });
    }

    return NextResponse.json(tenantsWithRentals, { status: 200 });
    
  } catch (error) {
    console.error('View Tenants API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}