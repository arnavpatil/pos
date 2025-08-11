import { NextRequest, NextResponse } from 'next/server';
import { CubeDetails, CubeAssignment } from '@/types/agentPortal';

// Mock data - In production, this would come from your database
const mockCubes: CubeDetails[] = [
  {
    id: 'cube-001',
    name: 'A-01',
    location: {
      section: 'A',
      row: '1',
      position: '01',
      floor: 'Ground',
    },
    dimensions: {
      width: 24,
      height: 36,
      depth: 18,
      unit: 'inches',
    },
    features: {
      hasLighting: true,
      hasLock: true,
      hasGlass: true,
      hasMirror: false,
      hasShelf: true,
      shelfCount: 3,
      hasElectricalOutlet: true,
      customFeatures: ['LED strip lighting', 'Adjustable shelves'],
    },
    condition: 'excellent',
    monthlyRent: 450.00,
    status: 'occupied',
    tenantId: 'tenant-001',
    assignedDate: '2024-01-15',
    lastMaintenanceDate: '2024-02-15',
    nextMaintenanceDate: '2024-05-15',
    maintenanceNotes: 'Regular cleaning and LED check completed',
    images: [
      '/images/cubes/cube-a01-1.jpg',
      '/images/cubes/cube-a01-2.jpg',
    ],
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
  },
  {
    id: 'cube-002',
    name: 'A-02',
    location: {
      section: 'A',
      row: '1',
      position: '02',
      floor: 'Ground',
    },
    dimensions: {
      width: 24,
      height: 36,
      depth: 18,
      unit: 'inches',
    },
    features: {
      hasLighting: true,
      hasLock: true,
      hasGlass: true,
      hasMirror: true,
      hasShelf: true,
      shelfCount: 2,
      hasElectricalOutlet: false,
      customFeatures: ['Mirror backing', 'Premium glass'],
    },
    condition: 'good',
    monthlyRent: 520.00,
    status: 'occupied',
    tenantId: 'tenant-002',
    assignedDate: '2024-02-01',
    lastMaintenanceDate: '2024-01-30',
    nextMaintenanceDate: '2024-04-30',
    maintenanceNotes: 'Mirror cleaned, lock mechanism serviced',
    images: [
      '/images/cubes/cube-a02-1.jpg',
    ],
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-30T14:20:00Z',
  },
  {
    id: 'cube-003',
    name: 'B-01',
    location: {
      section: 'B',
      row: '1',
      position: '01',
      floor: 'Ground',
    },
    dimensions: {
      width: 30,
      height: 42,
      depth: 20,
      unit: 'inches',
    },
    features: {
      hasLighting: true,
      hasLock: true,
      hasGlass: true,
      hasMirror: false,
      hasShelf: true,
      shelfCount: 4,
      hasElectricalOutlet: true,
      customFeatures: ['Extra large size', 'Double electrical outlets'],
    },
    condition: 'excellent',
    monthlyRent: 650.00,
    status: 'available',
    lastMaintenanceDate: '2024-03-01',
    nextMaintenanceDate: '2024-06-01',
    maintenanceNotes: 'Deep cleaned and ready for new tenant',
    images: [
      '/images/cubes/cube-b01-1.jpg',
      '/images/cubes/cube-b01-2.jpg',
      '/images/cubes/cube-b01-3.jpg',
    ],
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-03-01T09:15:00Z',
  },
  {
    id: 'cube-004',
    name: 'C-15',
    location: {
      section: 'C',
      row: '3',
      position: '15',
      floor: 'Ground',
    },
    dimensions: {
      width: 20,
      height: 30,
      depth: 16,
      unit: 'inches',
    },
    features: {
      hasLighting: false,
      hasLock: true,
      hasGlass: false,
      hasMirror: false,
      hasShelf: true,
      shelfCount: 2,
      hasElectricalOutlet: false,
      customFeatures: ['Budget-friendly option'],
    },
    condition: 'fair',
    monthlyRent: 280.00,
    status: 'maintenance',
    lastMaintenanceDate: '2024-03-10',
    nextMaintenanceDate: '2024-03-20',
    maintenanceNotes: 'Lock replacement needed, shelf adjustment required',
    images: [
      '/images/cubes/cube-c15-1.jpg',
    ],
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-03-10T16:45:00Z',
  },
  {
    id: 'cube-005',
    name: 'D-08',
    location: {
      section: 'D',
      row: '2',
      position: '08',
      floor: 'Second',
    },
    dimensions: {
      width: 26,
      height: 38,
      depth: 19,
      unit: 'inches',
    },
    features: {
      hasLighting: true,
      hasLock: true,
      hasGlass: true,
      hasMirror: true,
      hasShelf: true,
      shelfCount: 3,
      hasElectricalOutlet: true,
      customFeatures: ['Second floor premium location', 'Enhanced security'],
    },
    condition: 'excellent',
    monthlyRent: 580.00,
    status: 'reserved',
    lastMaintenanceDate: '2024-02-20',
    nextMaintenanceDate: '2024-05-20',
    maintenanceNotes: 'Premium maintenance completed',
    images: [
      '/images/cubes/cube-d08-1.jpg',
      '/images/cubes/cube-d08-2.jpg',
    ],
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-02-20T11:30:00Z',
  },
];

const mockAssignments: CubeAssignment[] = [
  {
    id: 'assignment-001',
    cubeId: 'cube-001',
    tenantId: 'tenant-001',
    assignedDate: '2024-01-15',
    monthlyRent: 450.00,
    securityDeposit: 900.00,
    status: 'active',
    startDate: '2024-01-15',
    autoRenew: true,
    specialTerms: 'First month 50% discount applied',
    notes: 'Tenant requested LED lighting upgrade',
    createdBy: 'agent-001',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'assignment-002',
    cubeId: 'cube-002',
    tenantId: 'tenant-002',
    assignedDate: '2024-02-01',
    monthlyRent: 520.00,
    securityDeposit: 1040.00,
    status: 'active',
    startDate: '2024-02-01',
    autoRenew: false,
    notes: 'Premium cube with mirror backing',
    createdBy: 'agent-002',
    createdAt: '2024-02-01T10:30:00Z',
    updatedAt: '2024-02-01T10:30:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cubeId = searchParams.get('id');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const section = searchParams.get('section');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get specific cube
    if (cubeId) {
      const cube = mockCubes.find(c => c.id === cubeId);
      if (!cube) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'CUBE_NOT_FOUND',
              message: 'Cube not found',
            },
          },
          { status: 404 }
        );
      }

      const assignment = mockAssignments.find(a => a.cubeId === cubeId && a.status === 'active');

      return NextResponse.json({
        success: true,
        data: {
          cube,
          assignment,
        },
      });
    }

    // Get cube assignments
    if (type === 'assignments') {
      const assignments = cubeId 
        ? mockAssignments.filter(a => a.cubeId === cubeId)
        : mockAssignments;
      
      return NextResponse.json({
        success: true,
        data: assignments,
      });
    }

    // Get cube statistics
    if (type === 'stats') {
      const stats = {
        total: mockCubes.length,
        available: mockCubes.filter(c => c.status === 'available').length,
        occupied: mockCubes.filter(c => c.status === 'occupied').length,
        maintenance: mockCubes.filter(c => c.status === 'maintenance').length,
        reserved: mockCubes.filter(c => c.status === 'reserved').length,
        outOfService: mockCubes.filter(c => c.status === 'out_of_service').length,
        occupancyRate: (mockCubes.filter(c => c.status === 'occupied').length / mockCubes.length) * 100,
        averageRent: mockCubes.reduce((sum, cube) => sum + cube.monthlyRent, 0) / mockCubes.length,
        totalRevenue: mockCubes
          .filter(c => c.status === 'occupied')
          .reduce((sum, cube) => sum + cube.monthlyRent, 0),
      };
      
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    // Filter cubes
    let filteredCubes = mockCubes;

    if (status) {
      filteredCubes = filteredCubes.filter(c => c.status === status);
    }

    if (section) {
      filteredCubes = filteredCubes.filter(c => c.location.section === section);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredCubes = filteredCubes.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.location.section.toLowerCase().includes(searchLower) ||
        c.features.customFeatures.some(f => f.toLowerCase().includes(searchLower))
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCubes = filteredCubes.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedCubes,
      meta: {
        page,
        limit,
        total: filteredCubes.length,
        hasMore: endIndex < filteredCubes.length,
      },
    });
  } catch (error) {
    console.error('Cubes API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CUBES_ERROR',
          message: 'Failed to fetch cubes data',
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
      case 'create-cube':
        // In production, this would create a new cube in the database
        const newCube: CubeDetails = {
          id: `cube-${Date.now()}`,
          ...data,
          status: 'available',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return NextResponse.json({
          success: true,
          data: newCube,
          message: 'Cube created successfully',
        });

      case 'update-cube':
        const { cubeId, updates } = data;
        // In production, this would update the cube in the database
        return NextResponse.json({
          success: true,
          data: { id: cubeId, ...updates, updatedAt: new Date().toISOString() },
          message: 'Cube updated successfully',
        });

      case 'assign-cube':
        const { cubeId: assignCubeId, tenantId, assignmentData } = data;
        // In production, this would create a new assignment in the database
        const newAssignment: CubeAssignment = {
          id: `assignment-${Date.now()}`,
          cubeId: assignCubeId,
          tenantId,
          assignedDate: new Date().toISOString().split('T')[0],
          status: 'active',
          createdBy: 'current-agent', // This would come from auth context
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...assignmentData,
        };
        
        return NextResponse.json({
          success: true,
          data: newAssignment,
          message: 'Cube assigned successfully',
        });

      case 'unassign-cube':
        const { cubeId: unassignCubeId, reason } = data;
        // In production, this would update the assignment status in the database
        return NextResponse.json({
          success: true,
          message: 'Cube unassigned successfully',
        });

      case 'update-status':
        const { cubeId: statusCubeId, status, maintenanceNotes } = data;
        // In production, this would update the cube status in the database
        return NextResponse.json({
          success: true,
          message: `Cube status updated to ${status}`,
        });

      case 'schedule-maintenance':
        const { cubeId: maintCubeId, maintenanceDate, notes } = data;
        // In production, this would schedule maintenance in the database
        return NextResponse.json({
          success: true,
          message: 'Maintenance scheduled successfully',
        });

      case 'bulk-update':
        const { cubeIds, bulkUpdates } = data;
        // In production, this would update multiple cubes in the database
        return NextResponse.json({
          success: true,
          message: `${cubeIds.length} cubes updated successfully`,
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
    console.error('Cubes POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CUBES_POST_ERROR',
          message: 'Failed to process cube action',
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
            message: 'Cube ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would update the cube in the database
    return NextResponse.json({
      success: true,
      data: { id, ...updates, updatedAt: new Date().toISOString() },
      message: 'Cube updated successfully',
    });
  } catch (error) {
    console.error('Cubes PUT API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CUBES_PUT_ERROR',
          message: 'Failed to update cube',
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
    const cubeId = searchParams.get('id');

    if (!cubeId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_ID',
            message: 'Cube ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would soft delete the cube in the database
    return NextResponse.json({
      success: true,
      message: 'Cube deleted successfully',
    });
  } catch (error) {
    console.error('Cubes DELETE API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CUBES_DELETE_ERROR',
          message: 'Failed to delete cube',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}