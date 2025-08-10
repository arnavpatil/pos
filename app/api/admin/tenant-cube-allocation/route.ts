import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { mockCubes } from '../../../../data/mockCubes';

// Mock storage for allocations
let storedAllocations: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header missing' },
        { status: 401 }
      );
    }

    // Validate required fields
    const { tenantId, cubeId, startDate, endDate } = body;
    
    if (!tenantId || !cubeId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the cube to get monthly rent
    const cube = mockCubes.find(c => c.id === cubeId);
    if (!cube) {
      return NextResponse.json(
        { error: 'Cube not found' },
        { status: 404 }
      );
    }

    // Generate allocation data
    const allocationId = uuidv4();
    const currentTime = new Date().toISOString();
    const allocatedById = "b28b878a-7f65-4ef2-8367-a907d38a6db9"; // Mock admin ID

    const allocation = {
      id: allocationId,
      tenantId,
      cubeId,
      startDate,
      endDate,
      status: "ACTIVE",
      monthlyRent: cube.pricePerMonth,
      lastPayment: null,
      createdAt: currentTime,
      updatedAt: currentTime,
      allocatedById
    };

    storedAllocations.push(allocation);

    return NextResponse.json(allocation, { status: 200 });
    
  } catch (error) {
    console.error('Tenant Cube Allocation API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header missing' },
        { status: 401 }
      );
    }

    return NextResponse.json(storedAllocations, { status: 200 });
    
  } catch (error) {
    console.error('Tenant Cube Allocation API Error:', error);
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