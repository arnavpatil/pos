import { NextRequest, NextResponse } from 'next/server';
import { DashboardMetrics, ActivityItem, QuickAction } from '@/types/agentPortal';

// Mock data - In production, this would come from your database
const mockDashboardMetrics: DashboardMetrics = {
  totalTenants: 156,
  activeTenants: 142,
  totalCubes: 320,
  occupiedCubes: 287,
  todaysSales: 15420.50,
  todaysTransactions: 89,
  pendingReservations: 23,
  activeDisputes: 7,
  lowStockAlerts: 12,
  monthlyRevenue: 425680.75,
  occupancyRate: 89.7,
  averageTransactionValue: 173.26,
};

const mockRecentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'sale',
    title: 'New Sale Completed',
    description: 'Transaction #TXN-2024-001234 - $245.99',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    amount: 245.99,
    status: 'completed',
    priority: 'medium',
    userId: 'tenant-123',
    userName: 'Sarah Johnson',
  },
  {
    id: '2',
    type: 'reservation',
    title: 'New Pickup Reservation',
    description: 'Customer scheduled pickup for tomorrow 2:00 PM',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'high',
    userId: 'customer-456',
    userName: 'Mike Chen',
  },
  {
    id: '3',
    type: 'dispute',
    title: 'Damage Report Filed',
    description: 'Cube C-45 reported minor damage to display case',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'open',
    priority: 'urgent',
    userId: 'tenant-789',
    userName: 'Emma Davis',
  },
  {
    id: '4',
    type: 'tenant_action',
    title: 'New Tenant Registration',
    description: 'Alex Rodriguez completed registration for Cube B-12',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'completed',
    priority: 'medium',
    userId: 'tenant-101',
    userName: 'Alex Rodriguez',
  },
  {
    id: '5',
    type: 'inventory',
    title: 'Low Stock Alert',
    description: 'Product SKU-789 is below minimum threshold (5 units)',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    status: 'warning',
    priority: 'high',
    userId: 'system',
    userName: 'System',
  },
];

const mockQuickActions: QuickAction[] = [
  {
    id: '1',
    title: 'Process Sale',
    description: 'Start a new transaction',
    icon: '💳',
    action: 'pos-system',
    color: 'bg-green-500',
  },
  {
    id: '2',
    title: 'Add Tenant',
    description: 'Register new tenant',
    icon: '👤',
    action: 'tenant-management',
    color: 'bg-blue-500',
  },
  {
    id: '3',
    title: 'Manage Inventory',
    description: 'Update stock levels',
    icon: '📦',
    action: 'product-inventory',
    color: 'bg-purple-500',
  },
  {
    id: '4',
    title: 'View Reports',
    description: 'Generate analytics',
    icon: '📊',
    action: 'reports-analytics',
    color: 'bg-orange-500',
  },
  {
    id: '5',
    title: 'Handle Disputes',
    description: 'Resolve issues',
    icon: '⚠️',
    action: 'dispute-management',
    color: 'bg-red-500',
    count: 7,
  },
  {
    id: '6',
    title: 'Reservations',
    description: 'Manage bookings',
    icon: '📅',
    action: 'reservation-system',
    color: 'bg-indigo-500',
    count: 23,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'metrics':
        return NextResponse.json({
          success: true,
          data: mockDashboardMetrics,
        });

      case 'activity':
        const limit = parseInt(searchParams.get('limit') || '10');
        const limitedActivity = mockRecentActivity.slice(0, limit);
        return NextResponse.json({
          success: true,
          data: limitedActivity,
        });

      case 'quick-actions':
        return NextResponse.json({
          success: true,
          data: mockQuickActions,
        });

      case 'all':
      default:
        return NextResponse.json({
          success: true,
          data: {
            metrics: mockDashboardMetrics,
            recentActivity: mockRecentActivity.slice(0, 5),
            quickActions: mockQuickActions,
          },
        });
    }
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DASHBOARD_ERROR',
          message: 'Failed to fetch dashboard data',
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
      case 'refresh-metrics':
        // In production, this would trigger a metrics recalculation
        return NextResponse.json({
          success: true,
          data: mockDashboardMetrics,
          message: 'Metrics refreshed successfully',
        });

      case 'mark-activity-read':
        const { activityId } = data;
        // In production, this would update the activity status in the database
        return NextResponse.json({
          success: true,
          message: `Activity ${activityId} marked as read`,
        });

      case 'dismiss-alert':
        const { alertId } = data;
        // In production, this would dismiss the alert in the database
        return NextResponse.json({
          success: true,
          message: `Alert ${alertId} dismissed`,
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
    console.error('Dashboard POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DASHBOARD_POST_ERROR',
          message: 'Failed to process dashboard action',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}