import { NextRequest, NextResponse } from 'next/server';
import { Notification } from '@/types/agentPortal';

// Mock data - In production, this would come from your database
const mockNotifications: Notification[] = [
  {
    id: 'notification-001',
    type: 'alert',
    category: 'system',
    priority: 'high',
    title: 'Low Stock Alert',
    message: 'Silver necklace inventory is running low (2 items remaining)',
    details: {
      productId: 'product-001',
      productName: 'Silver Necklace',
      currentStock: 2,
      minimumStock: 5,
      tenantId: 'tenant-001',
      tenantName: 'Sarah Johnson',
    },
    isRead: false,
    isArchived: false,
    actionRequired: true,
    actions: [
      {
        id: 'action-001',
        label: 'Restock Product',
        type: 'primary',
        url: '/agent-portal/inventory?product=product-001',
      },
      {
        id: 'action-002',
        label: 'Contact Tenant',
        type: 'secondary',
        url: '/agent-portal/tenants?id=tenant-001',
      },
    ],
    metadata: {
      source: 'inventory_system',
      relatedEntity: 'product',
      relatedEntityId: 'product-001',
      urgencyLevel: 'medium',
    },
    recipients: ['agent-001', 'agent-002'],
    sender: {
      id: 'system',
      name: 'Inventory System',
      type: 'system',
    },
    tags: ['inventory', 'stock', 'alert'],
    expiresAt: '2024-03-20T00:00:00Z',
    createdAt: '2024-03-10T09:30:00Z',
    updatedAt: '2024-03-10T09:30:00Z',
  },
  {
    id: 'notification-002',
    type: 'info',
    category: 'reservation',
    priority: 'medium',
    title: 'New Pickup Reservation',
    message: 'Alice Johnson has scheduled a pickup for tomorrow at 2:30 PM',
    details: {
      reservationId: 'reservation-001',
      customerName: 'Alice Johnson',
      scheduledTime: '2024-03-15T14:30:00Z',
      items: ['Silver Necklace', 'Matching Earrings'],
      totalAmount: 134.99,
      tenantId: 'tenant-001',
      tenantName: 'Sarah Johnson',
    },
    isRead: false,
    isArchived: false,
    actionRequired: true,
    actions: [
      {
        id: 'action-003',
        label: 'View Reservation',
        type: 'primary',
        url: '/agent-portal/reservations?id=reservation-001',
      },
      {
        id: 'action-004',
        label: 'Notify Tenant',
        type: 'secondary',
        action: 'notify_tenant',
      },
    ],
    metadata: {
      source: 'reservation_system',
      relatedEntity: 'reservation',
      relatedEntityId: 'reservation-001',
      urgencyLevel: 'low',
    },
    recipients: ['agent-001'],
    sender: {
      id: 'customer-001',
      name: 'Alice Johnson',
      type: 'customer',
    },
    tags: ['reservation', 'pickup', 'customer'],
    createdAt: '2024-03-12T10:15:00Z',
    updatedAt: '2024-03-12T10:15:00Z',
  },
  {
    id: 'notification-003',
    type: 'warning',
    category: 'dispute',
    priority: 'high',
    title: 'New Dispute Case',
    message: 'Emma Davis reported damage to cube display case C-45',
    details: {
      disputeId: 'dispute-001',
      caseNumber: 'CASE-2024-001',
      reportedBy: 'Emma Davis',
      disputeType: 'damage',
      cubeId: 'cube-004',
      cubeName: 'C-45',
      description: 'Glass display case has a crack on the front panel',
    },
    isRead: true,
    isArchived: false,
    actionRequired: true,
    actions: [
      {
        id: 'action-005',
        label: 'Investigate Case',
        type: 'primary',
        url: '/agent-portal/disputes?id=dispute-001',
      },
      {
        id: 'action-006',
        label: 'Contact Tenant',
        type: 'secondary',
        url: '/agent-portal/tenants?id=tenant-003',
      },
    ],
    metadata: {
      source: 'dispute_system',
      relatedEntity: 'dispute',
      relatedEntityId: 'dispute-001',
      urgencyLevel: 'high',
    },
    recipients: ['agent-001', 'agent-002'],
    sender: {
      id: 'tenant-003',
      name: 'Emma Davis',
      type: 'tenant',
    },
    tags: ['dispute', 'damage', 'cube', 'urgent'],
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-10T14:35:00Z',
  },
  {
    id: 'notification-004',
    type: 'success',
    category: 'payment',
    priority: 'low',
    title: 'Payment Processed',
    message: 'Payment of $1,200 for vintage watch purchase has been processed successfully',
    details: {
      transactionId: 'txn-001',
      amount: 1200.00,
      paymentMethod: 'card',
      customerName: 'Maria Garcia',
      tenantName: 'Mike Chen',
      productName: 'Vintage Watch',
    },
    isRead: true,
    isArchived: false,
    actionRequired: false,
    actions: [
      {
        id: 'action-007',
        label: 'View Transaction',
        type: 'secondary',
        url: '/agent-portal/sales?transaction=txn-001',
      },
    ],
    metadata: {
      source: 'payment_system',
      relatedEntity: 'transaction',
      relatedEntityId: 'txn-001',
      urgencyLevel: 'low',
    },
    recipients: ['agent-001'],
    sender: {
      id: 'system',
      name: 'Payment System',
      type: 'system',
    },
    tags: ['payment', 'success', 'transaction'],
    createdAt: '2024-03-10T13:26:00Z',
    updatedAt: '2024-03-10T13:26:00Z',
  },
  {
    id: 'notification-005',
    type: 'reminder',
    category: 'maintenance',
    priority: 'medium',
    title: 'Cube Maintenance Due',
    message: 'Cube A-12 is due for monthly maintenance inspection',
    details: {
      cubeId: 'cube-001',
      cubeName: 'A-12',
      lastMaintenance: '2024-02-15T00:00:00Z',
      nextDue: '2024-03-15T00:00:00Z',
      maintenanceType: 'monthly_inspection',
      tenantId: 'tenant-001',
      tenantName: 'Sarah Johnson',
    },
    isRead: false,
    isArchived: false,
    actionRequired: true,
    actions: [
      {
        id: 'action-008',
        label: 'Schedule Maintenance',
        type: 'primary',
        action: 'schedule_maintenance',
      },
      {
        id: 'action-009',
        label: 'View Cube Details',
        type: 'secondary',
        url: '/agent-portal/cubes?id=cube-001',
      },
    ],
    metadata: {
      source: 'maintenance_system',
      relatedEntity: 'cube',
      relatedEntityId: 'cube-001',
      urgencyLevel: 'medium',
    },
    recipients: ['agent-001'],
    sender: {
      id: 'system',
      name: 'Maintenance System',
      type: 'system',
    },
    tags: ['maintenance', 'cube', 'reminder'],
    createdAt: '2024-03-12T08:00:00Z',
    updatedAt: '2024-03-12T08:00:00Z',
  },
  {
    id: 'notification-006',
    type: 'info',
    category: 'tenant',
    priority: 'low',
    title: 'New Tenant Application',
    message: 'David Brown has submitted an application for cube rental',
    details: {
      applicantName: 'David Brown',
      applicantEmail: 'david.brown@email.com',
      requestedCubeType: 'medium',
      businessType: 'Handmade Crafts',
      applicationId: 'app-001',
      submittedAt: '2024-03-11T16:45:00Z',
    },
    isRead: false,
    isArchived: false,
    actionRequired: true,
    actions: [
      {
        id: 'action-010',
        label: 'Review Application',
        type: 'primary',
        url: '/agent-portal/tenants?application=app-001',
      },
      {
        id: 'action-011',
        label: 'Contact Applicant',
        type: 'secondary',
        action: 'contact_applicant',
      },
    ],
    metadata: {
      source: 'tenant_system',
      relatedEntity: 'application',
      relatedEntityId: 'app-001',
      urgencyLevel: 'low',
    },
    recipients: ['agent-001', 'agent-002'],
    sender: {
      id: 'applicant-001',
      name: 'David Brown',
      type: 'applicant',
    },
    tags: ['tenant', 'application', 'new'],
    createdAt: '2024-03-11T16:45:00Z',
    updatedAt: '2024-03-11T16:45:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const isRead = searchParams.get('isRead');
    const isArchived = searchParams.get('isArchived');
    const actionRequired = searchParams.get('actionRequired');
    const recipientId = searchParams.get('recipientId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get specific notification
    if (notificationId) {
      const notification = mockNotifications.find(n => n.id === notificationId);
      if (!notification) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOTIFICATION_NOT_FOUND',
              message: 'Notification not found',
            },
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: notification,
      });
    }

    // Get notification statistics
    if (type === 'stats') {
      const stats = {
        total: mockNotifications.length,
        unread: mockNotifications.filter(n => !n.isRead).length,
        read: mockNotifications.filter(n => n.isRead).length,
        archived: mockNotifications.filter(n => n.isArchived).length,
        actionRequired: mockNotifications.filter(n => n.actionRequired).length,
        byType: mockNotifications.reduce((acc, n) => {
          acc[n.type] = (acc[n.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byCategory: mockNotifications.reduce((acc, n) => {
          acc[n.category] = (acc[n.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byPriority: mockNotifications.reduce((acc, n) => {
          acc[n.priority] = (acc[n.priority] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        recentActivity: mockNotifications
          .filter(n => new Date(n.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000))
          .length,
      };
      
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    // Get notification settings
    if (type === 'settings') {
      const settings = {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        categories: {
          system: { enabled: true, priority: 'high' },
          reservation: { enabled: true, priority: 'medium' },
          dispute: { enabled: true, priority: 'high' },
          payment: { enabled: true, priority: 'low' },
          maintenance: { enabled: true, priority: 'medium' },
          tenant: { enabled: true, priority: 'low' },
        },
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '08:00',
        },
        digestFrequency: 'daily',
        autoArchive: {
          enabled: true,
          afterDays: 30,
        },
      };
      
      return NextResponse.json({
        success: true,
        data: settings,
      });
    }

    // Filter notifications
    let filteredNotifications = mockNotifications;

    if (type && type !== 'all' && type !== 'stats' && type !== 'settings') {
      filteredNotifications = filteredNotifications.filter(n => n.type === type);
    }

    if (category) {
      filteredNotifications = filteredNotifications.filter(n => n.category === category);
    }

    if (priority) {
      filteredNotifications = filteredNotifications.filter(n => n.priority === priority);
    }

    if (isRead !== null) {
      const readStatus = isRead === 'true';
      filteredNotifications = filteredNotifications.filter(n => n.isRead === readStatus);
    }

    if (isArchived !== null) {
      const archivedStatus = isArchived === 'true';
      filteredNotifications = filteredNotifications.filter(n => n.isArchived === archivedStatus);
    }

    if (actionRequired !== null) {
      const actionRequiredStatus = actionRequired === 'true';
      filteredNotifications = filteredNotifications.filter(n => n.actionRequired === actionRequiredStatus);
    }

    if (recipientId) {
      filteredNotifications = filteredNotifications.filter(n => 
        n.recipients.includes(recipientId)
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredNotifications = filteredNotifications.filter(n => 
        n.title.toLowerCase().includes(searchLower) ||
        n.message.toLowerCase().includes(searchLower) ||
        n.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by creation date (newest first) and priority
    filteredNotifications.sort((a, b) => {
      const priorityOrder = { critical: 5, urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedNotifications,
      meta: {
        page,
        limit,
        total: filteredNotifications.length,
        hasMore: endIndex < filteredNotifications.length,
      },
    });
  } catch (error) {
    console.error('Notifications API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOTIFICATIONS_ERROR',
          message: 'Failed to fetch notifications data',
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
      case 'create-notification':
        // In production, this would create a new notification in the database
        const newNotification: Notification = {
          id: `notification-${Date.now()}`,
          isRead: false,
          isArchived: false,
          metadata: {
            source: 'manual',
            urgencyLevel: data.priority || 'medium',
          },
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return NextResponse.json({
          success: true,
          data: newNotification,
          message: 'Notification created successfully',
        });

      case 'mark-as-read':
        const { notificationIds: readIds } = data;
        // In production, this would update notifications in the database
        return NextResponse.json({
          success: true,
          message: `${readIds.length} notification(s) marked as read`,
        });

      case 'mark-as-unread':
        const { notificationIds: unreadIds } = data;
        // In production, this would update notifications in the database
        return NextResponse.json({
          success: true,
          message: `${unreadIds.length} notification(s) marked as unread`,
        });

      case 'archive':
        const { notificationIds: archiveIds } = data;
        // In production, this would archive notifications in the database
        return NextResponse.json({
          success: true,
          message: `${archiveIds.length} notification(s) archived`,
        });

      case 'unarchive':
        const { notificationIds: unarchiveIds } = data;
        // In production, this would unarchive notifications in the database
        return NextResponse.json({
          success: true,
          message: `${unarchiveIds.length} notification(s) unarchived`,
        });

      case 'delete':
        const { notificationIds: deleteIds } = data;
        // In production, this would delete notifications from the database
        return NextResponse.json({
          success: true,
          message: `${deleteIds.length} notification(s) deleted`,
        });

      case 'send-message':
        const { recipients, subject, message, priority, category } = data;
        // In production, this would send messages to specified recipients
        const messageNotification = {
          id: `notification-${Date.now()}`,
          type: 'info',
          category: category || 'message',
          priority: priority || 'medium',
          title: subject,
          message: message,
          recipients: recipients,
          sender: {
            id: 'agent-001', // Would be from authenticated user
            name: 'Agent',
            type: 'agent',
          },
          isRead: false,
          isArchived: false,
          actionRequired: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return NextResponse.json({
          success: true,
          data: messageNotification,
          message: 'Message sent successfully',
        });

      case 'update-settings':
        const { settings } = data;
        // In production, this would update user notification settings
        return NextResponse.json({
          success: true,
          message: 'Notification settings updated successfully',
        });

      case 'test-notification':
        const { type: testType, recipient } = data;
        // In production, this would send a test notification
        return NextResponse.json({
          success: true,
          message: `Test ${testType} notification sent to ${recipient}`,
        });

      case 'bulk-action':
        const { notificationIds: bulkIds, bulkAction } = data;
        // In production, this would perform bulk actions on notifications
        let actionMessage = '';
        switch (bulkAction) {
          case 'mark-read':
            actionMessage = 'marked as read';
            break;
          case 'archive':
            actionMessage = 'archived';
            break;
          case 'delete':
            actionMessage = 'deleted';
            break;
          default:
            actionMessage = 'updated';
        }
        
        return NextResponse.json({
          success: true,
          message: `${bulkIds.length} notification(s) ${actionMessage}`,
        });

      case 'dismiss-action':
        const { notificationId, actionId } = data;
        // In production, this would dismiss a specific action from a notification
        return NextResponse.json({
          success: true,
          message: 'Action dismissed successfully',
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
    console.error('Notifications POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOTIFICATIONS_POST_ERROR',
          message: 'Failed to process notification action',
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
            message: 'Notification ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would update the notification in the database
    return NextResponse.json({
      success: true,
      data: { id, ...updates, updatedAt: new Date().toISOString() },
      message: 'Notification updated successfully',
    });
  } catch (error) {
    console.error('Notifications PUT API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOTIFICATIONS_PUT_ERROR',
          message: 'Failed to update notification',
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
    const notificationId = searchParams.get('id');
    const bulkIds = searchParams.get('ids');

    if (!notificationId && !bulkIds) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_ID',
            message: 'Notification ID or bulk IDs are required',
          },
        },
        { status: 400 }
      );
    }

    if (bulkIds) {
      const ids = bulkIds.split(',');
      // In production, this would delete multiple notifications
      return NextResponse.json({
        success: true,
        message: `${ids.length} notification(s) deleted successfully`,
      });
    }

    // In production, this would delete the notification from the database
    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Notifications DELETE API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOTIFICATIONS_DELETE_ERROR',
          message: 'Failed to delete notification',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}