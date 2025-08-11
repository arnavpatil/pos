import { NextRequest, NextResponse } from 'next/server';
import { Reservation } from '@/types/agentPortal';

// Mock data - In production, this would come from your database
const mockReservations: Reservation[] = [
  {
    id: 'reservation-001',
    reservationNumber: 'RES-2024-001',
    type: 'pickup',
    status: 'confirmed',
    priority: 'normal',
    customer: {
      id: 'customer-001',
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1-555-0123',
    },
    tenant: {
      id: 'tenant-001',
      name: 'Sarah Johnson',
      cubeName: 'A-12',
    },
    items: [
      {
        id: 'item-001',
        name: 'Silver Necklace',
        description: 'Handcrafted silver necklace with pendant',
        quantity: 1,
        price: 89.99,
        sku: 'SN-001',
        category: 'Jewelry',
      },
      {
        id: 'item-002',
        name: 'Matching Earrings',
        description: 'Silver earrings to match the necklace',
        quantity: 1,
        price: 45.00,
        sku: 'SE-001',
        category: 'Jewelry',
      },
    ],
    totalAmount: 134.99,
    scheduledDateTime: '2024-03-15T14:30:00Z',
    duration: 30, // minutes
    location: {
      type: 'cube',
      id: 'cube-001',
      name: 'A-12',
      address: 'Main Store - Cube A-12',
    },
    specialInstructions: 'Customer prefers to inspect items before finalizing purchase',
    paymentStatus: 'pending',
    paymentMethod: 'card',
    depositAmount: 0,
    timeline: [
      {
        id: 'timeline-001',
        action: 'Reservation Created',
        description: 'Customer created pickup reservation online',
        performedBy: 'customer-001',
        timestamp: '2024-03-12T10:15:00Z',
        isInternal: false,
      },
      {
        id: 'timeline-002',
        action: 'Tenant Notified',
        description: 'Tenant Sarah Johnson notified of pickup reservation',
        performedBy: 'system',
        timestamp: '2024-03-12T10:16:00Z',
        isInternal: true,
      },
      {
        id: 'timeline-003',
        action: 'Reservation Confirmed',
        description: 'Tenant confirmed availability for scheduled time',
        performedBy: 'tenant-001',
        timestamp: '2024-03-12T11:30:00Z',
        isInternal: false,
      },
    ],
    notifications: {
      customerReminder: true,
      tenantReminder: true,
      agentNotification: true,
      reminderTime: 60, // minutes before appointment
    },
    tags: ['jewelry', 'inspection', 'first-time-customer'],
    createdAt: '2024-03-12T10:15:00Z',
    updatedAt: '2024-03-12T11:30:00Z',
  },
  {
    id: 'reservation-002',
    reservationNumber: 'RES-2024-002',
    type: 'consultation',
    status: 'pending',
    priority: 'high',
    customer: {
      id: 'customer-002',
      name: 'Robert Davis',
      email: 'robert.davis@email.com',
      phone: '+1-555-0456',
    },
    tenant: {
      id: 'tenant-003',
      name: 'Emma Davis',
      cubeName: 'C-45',
    },
    items: [
      {
        id: 'item-003',
        name: 'Custom Ring Design',
        description: 'Custom engagement ring consultation and design',
        quantity: 1,
        price: 2500.00,
        sku: 'CR-CONSULT',
        category: 'Custom Jewelry',
      },
    ],
    totalAmount: 2500.00,
    scheduledDateTime: '2024-03-16T16:00:00Z',
    duration: 90, // minutes
    location: {
      type: 'cube',
      id: 'cube-004',
      name: 'C-45',
      address: 'Main Store - Cube C-45',
    },
    specialInstructions: 'Bring diamond size preferences and budget discussion materials',
    paymentStatus: 'deposit_paid',
    paymentMethod: 'card',
    depositAmount: 250.00,
    timeline: [
      {
        id: 'timeline-004',
        action: 'Consultation Requested',
        description: 'Customer requested custom ring design consultation',
        performedBy: 'customer-002',
        timestamp: '2024-03-13T09:20:00Z',
        isInternal: false,
      },
      {
        id: 'timeline-005',
        action: 'Deposit Paid',
        description: 'Customer paid $250 consultation deposit',
        performedBy: 'customer-002',
        timestamp: '2024-03-13T09:25:00Z',
        isInternal: false,
      },
    ],
    notifications: {
      customerReminder: true,
      tenantReminder: true,
      agentNotification: true,
      reminderTime: 120, // minutes before appointment
    },
    tags: ['custom-jewelry', 'consultation', 'high-value', 'engagement'],
    createdAt: '2024-03-13T09:20:00Z',
    updatedAt: '2024-03-13T09:25:00Z',
  },
  {
    id: 'reservation-003',
    reservationNumber: 'RES-2024-003',
    type: 'pickup',
    status: 'completed',
    priority: 'normal',
    customer: {
      id: 'customer-003',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1-555-0789',
    },
    tenant: {
      id: 'tenant-002',
      name: 'Mike Chen',
      cubeName: 'B-23',
    },
    items: [
      {
        id: 'item-004',
        name: 'Vintage Watch',
        description: '1960s vintage Omega watch, fully serviced',
        quantity: 1,
        price: 1200.00,
        sku: 'VW-OMEGA-60',
        category: 'Watches',
      },
    ],
    totalAmount: 1200.00,
    scheduledDateTime: '2024-03-10T13:00:00Z',
    duration: 20, // minutes
    location: {
      type: 'cube',
      id: 'cube-002',
      name: 'B-23',
      address: 'Main Store - Cube B-23',
    },
    specialInstructions: 'Customer is a watch collector, interested in provenance details',
    paymentStatus: 'completed',
    paymentMethod: 'card',
    depositAmount: 0,
    actualDateTime: '2024-03-10T13:05:00Z',
    completionNotes: 'Customer was very satisfied with the watch condition and authenticity documentation. Completed purchase successfully.',
    customerSatisfaction: 5,
    timeline: [
      {
        id: 'timeline-006',
        action: 'Reservation Created',
        description: 'Customer booked pickup appointment for vintage watch',
        performedBy: 'customer-003',
        timestamp: '2024-03-08T15:45:00Z',
        isInternal: false,
      },
      {
        id: 'timeline-007',
        action: 'Appointment Completed',
        description: 'Customer picked up watch and completed purchase',
        performedBy: 'tenant-002',
        timestamp: '2024-03-10T13:25:00Z',
        isInternal: false,
      },
      {
        id: 'timeline-008',
        action: 'Payment Processed',
        description: 'Payment of $1,200 processed successfully',
        performedBy: 'system',
        timestamp: '2024-03-10T13:26:00Z',
        isInternal: true,
      },
    ],
    notifications: {
      customerReminder: true,
      tenantReminder: true,
      agentNotification: false,
      reminderTime: 60,
    },
    tags: ['watches', 'vintage', 'collector', 'completed'],
    createdAt: '2024-03-08T15:45:00Z',
    updatedAt: '2024-03-10T13:26:00Z',
  },
  {
    id: 'reservation-004',
    reservationNumber: 'RES-2024-004',
    type: 'pickup',
    status: 'cancelled',
    priority: 'normal',
    customer: {
      id: 'customer-004',
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      phone: '+1-555-0321',
    },
    tenant: {
      id: 'tenant-001',
      name: 'Sarah Johnson',
      cubeName: 'A-12',
    },
    items: [
      {
        id: 'item-005',
        name: 'Gold Bracelet',
        description: '14k gold chain bracelet',
        quantity: 1,
        price: 350.00,
        sku: 'GB-14K-001',
        category: 'Jewelry',
      },
    ],
    totalAmount: 350.00,
    scheduledDateTime: '2024-03-14T11:00:00Z',
    duration: 15,
    location: {
      type: 'cube',
      id: 'cube-001',
      name: 'A-12',
      address: 'Main Store - Cube A-12',
    },
    specialInstructions: '',
    paymentStatus: 'cancelled',
    paymentMethod: 'card',
    depositAmount: 0,
    cancellationReason: 'Customer found similar item elsewhere at lower price',
    cancelledAt: '2024-03-13T16:30:00Z',
    cancelledBy: 'customer-004',
    timeline: [
      {
        id: 'timeline-009',
        action: 'Reservation Created',
        description: 'Customer booked pickup for gold bracelet',
        performedBy: 'customer-004',
        timestamp: '2024-03-11T14:20:00Z',
        isInternal: false,
      },
      {
        id: 'timeline-010',
        action: 'Reservation Cancelled',
        description: 'Customer cancelled reservation - found item elsewhere',
        performedBy: 'customer-004',
        timestamp: '2024-03-13T16:30:00Z',
        isInternal: false,
      },
    ],
    notifications: {
      customerReminder: false,
      tenantReminder: false,
      agentNotification: false,
      reminderTime: 60,
    },
    tags: ['cancelled', 'price-comparison'],
    createdAt: '2024-03-11T14:20:00Z',
    updatedAt: '2024-03-13T16:30:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get('id');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const tenantId = searchParams.get('tenantId');
    const customerId = searchParams.get('customerId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get specific reservation
    if (reservationId) {
      const reservation = mockReservations.find(r => r.id === reservationId);
      if (!reservation) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'RESERVATION_NOT_FOUND',
              message: 'Reservation not found',
            },
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: reservation,
      });
    }

    // Get reservation statistics
    if (type === 'stats') {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const thisWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const stats = {
        total: mockReservations.length,
        confirmed: mockReservations.filter(r => r.status === 'confirmed').length,
        pending: mockReservations.filter(r => r.status === 'pending').length,
        completed: mockReservations.filter(r => r.status === 'completed').length,
        cancelled: mockReservations.filter(r => r.status === 'cancelled').length,
        noShow: mockReservations.filter(r => r.status === 'no_show').length,
        today: mockReservations.filter(r => r.scheduledDateTime.startsWith(todayStr)).length,
        thisWeek: mockReservations.filter(r => new Date(r.scheduledDateTime) >= thisWeekStart).length,
        thisMonth: mockReservations.filter(r => new Date(r.scheduledDateTime) >= thisMonthStart).length,
        byType: mockReservations.reduce((acc, r) => {
          acc[r.type] = (acc[r.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byStatus: mockReservations.reduce((acc, r) => {
          acc[r.status] = (acc[r.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        averageDuration: mockReservations.reduce((sum, r) => sum + r.duration, 0) / mockReservations.length,
        totalRevenue: mockReservations
          .filter(r => r.status === 'completed')
          .reduce((sum, r) => sum + r.totalAmount, 0),
        averageSatisfaction: mockReservations
          .filter(r => r.customerSatisfaction)
          .reduce((sum, r) => sum + (r.customerSatisfaction || 0), 0) / 
          mockReservations.filter(r => r.customerSatisfaction).length || 0,
      };
      
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    // Get calendar data
    if (type === 'calendar') {
      const calendarData = mockReservations.map(r => ({
        id: r.id,
        title: `${r.customer.name} - ${r.items[0]?.name || 'Multiple Items'}`,
        start: r.scheduledDateTime,
        end: new Date(new Date(r.scheduledDateTime).getTime() + r.duration * 60000).toISOString(),
        status: r.status,
        type: r.type,
        priority: r.priority,
        tenant: r.tenant.name,
        customer: r.customer.name,
        amount: r.totalAmount,
      }));
      
      return NextResponse.json({
        success: true,
        data: calendarData,
      });
    }

    // Get availability slots
    if (type === 'availability') {
      const date = searchParams.get('date');
      const tenantIdParam = searchParams.get('tenantId');
      
      if (!date) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'MISSING_DATE',
              message: 'Date parameter is required for availability check',
            },
          },
          { status: 400 }
        );
      }

      // Generate available time slots (mock implementation)
      const slots = [];
      const startHour = 9; // 9 AM
      const endHour = 18; // 6 PM
      const slotDuration = 30; // 30 minutes

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const slotTime = `${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`;
          
          // Check if slot is already booked
          const isBooked = mockReservations.some(r => 
            r.scheduledDateTime === slotTime && 
            r.status !== 'cancelled' &&
            (!tenantIdParam || r.tenant.id === tenantIdParam)
          );

          if (!isBooked) {
            slots.push({
              time: slotTime,
              available: true,
              duration: slotDuration,
            });
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        data: slots,
      });
    }

    // Filter reservations
    let filteredReservations = mockReservations;

    if (type && type !== 'all' && type !== 'stats' && type !== 'calendar' && type !== 'availability') {
      filteredReservations = filteredReservations.filter(r => r.type === type);
    }

    if (status) {
      filteredReservations = filteredReservations.filter(r => r.status === status);
    }

    if (priority) {
      filteredReservations = filteredReservations.filter(r => r.priority === priority);
    }

    if (tenantId) {
      filteredReservations = filteredReservations.filter(r => r.tenant.id === tenantId);
    }

    if (customerId) {
      filteredReservations = filteredReservations.filter(r => r.customer.id === customerId);
    }

    if (dateFrom) {
      filteredReservations = filteredReservations.filter(r => 
        new Date(r.scheduledDateTime) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filteredReservations = filteredReservations.filter(r => 
        new Date(r.scheduledDateTime) <= new Date(dateTo)
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredReservations = filteredReservations.filter(r => 
        r.reservationNumber.toLowerCase().includes(searchLower) ||
        r.customer.name.toLowerCase().includes(searchLower) ||
        r.customer.email.toLowerCase().includes(searchLower) ||
        r.tenant.name.toLowerCase().includes(searchLower) ||
        r.items.some(item => item.name.toLowerCase().includes(searchLower)) ||
        r.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by scheduled date (newest first)
    filteredReservations.sort((a, b) => 
      new Date(b.scheduledDateTime).getTime() - new Date(a.scheduledDateTime).getTime()
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReservations = filteredReservations.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedReservations,
      meta: {
        page,
        limit,
        total: filteredReservations.length,
        hasMore: endIndex < filteredReservations.length,
      },
    });
  } catch (error) {
    console.error('Reservations API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RESERVATIONS_ERROR',
          message: 'Failed to fetch reservations data',
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
      case 'create-reservation':
        // In production, this would create a new reservation in the database
        const newReservation: Reservation = {
          id: `reservation-${Date.now()}`,
          reservationNumber: `RES-${new Date().getFullYear()}-${String(mockReservations.length + 1).padStart(3, '0')}`,
          status: 'pending',
          timeline: [
            {
              id: `timeline-${Date.now()}`,
              action: 'Reservation Created',
              description: `Reservation created by ${data.customer.name}`,
              performedBy: data.customer.id,
              timestamp: new Date().toISOString(),
              isInternal: false,
            },
          ],
          notifications: {
            customerReminder: true,
            tenantReminder: true,
            agentNotification: data.priority === 'high' || data.priority === 'urgent',
            reminderTime: data.type === 'consultation' ? 120 : 60,
          },
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return NextResponse.json({
          success: true,
          data: newReservation,
          message: 'Reservation created successfully',
        });

      case 'update-reservation':
        const { reservationId, updates } = data;
        // In production, this would update the reservation in the database
        return NextResponse.json({
          success: true,
          data: { id: reservationId, ...updates, updatedAt: new Date().toISOString() },
          message: 'Reservation updated successfully',
        });

      case 'confirm-reservation':
        const { reservationId: confirmId } = data;
        // In production, this would confirm the reservation and send notifications
        return NextResponse.json({
          success: true,
          message: 'Reservation confirmed successfully',
        });

      case 'cancel-reservation':
        const { reservationId: cancelId, reason, cancelledBy } = data;
        // In production, this would cancel the reservation and handle any refunds
        return NextResponse.json({
          success: true,
          message: 'Reservation cancelled successfully',
        });

      case 'reschedule-reservation':
        const { reservationId: rescheduleId, newDateTime, reason: rescheduleReason } = data;
        // In production, this would reschedule the reservation and notify parties
        return NextResponse.json({
          success: true,
          message: 'Reservation rescheduled successfully',
        });

      case 'complete-reservation':
        const { reservationId: completeId, completionNotes, customerSatisfaction } = data;
        // In production, this would mark reservation as completed and process payment
        return NextResponse.json({
          success: true,
          message: 'Reservation completed successfully',
        });

      case 'mark-no-show':
        const { reservationId: noShowId, notes } = data;
        // In production, this would mark as no-show and handle any penalties
        return NextResponse.json({
          success: true,
          message: 'Reservation marked as no-show',
        });

      case 'send-reminder':
        const { reservationId: reminderId, type: reminderType } = data;
        // In production, this would send reminder notifications
        return NextResponse.json({
          success: true,
          message: `${reminderType} reminder sent successfully`,
        });

      case 'check-availability':
        const { date, tenantId: availTenantId, duration } = data;
        // In production, this would check real availability
        return NextResponse.json({
          success: true,
          data: {
            available: true,
            suggestedTimes: [
              '2024-03-15T10:00:00Z',
              '2024-03-15T14:30:00Z',
              '2024-03-15T16:00:00Z',
            ],
          },
          message: 'Availability checked successfully',
        });

      case 'bulk-update':
        const { reservationIds, bulkUpdates } = data;
        // In production, this would update multiple reservations
        return NextResponse.json({
          success: true,
          message: `${reservationIds.length} reservations updated successfully`,
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
    console.error('Reservations POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RESERVATIONS_POST_ERROR',
          message: 'Failed to process reservation action',
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
            message: 'Reservation ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would update the reservation in the database
    return NextResponse.json({
      success: true,
      data: { id, ...updates, updatedAt: new Date().toISOString() },
      message: 'Reservation updated successfully',
    });
  } catch (error) {
    console.error('Reservations PUT API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RESERVATIONS_PUT_ERROR',
          message: 'Failed to update reservation',
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
    const reservationId = searchParams.get('id');

    if (!reservationId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_ID',
            message: 'Reservation ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would soft delete the reservation in the database
    return NextResponse.json({
      success: true,
      message: 'Reservation deleted successfully',
    });
  } catch (error) {
    console.error('Reservations DELETE API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RESERVATIONS_DELETE_ERROR',
          message: 'Failed to delete reservation',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}