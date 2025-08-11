import { NextRequest, NextResponse } from 'next/server';
import { DisputeCase } from '@/types/agentPortal';

// Mock data - In production, this would come from your database
const mockDisputes: DisputeCase[] = [
  {
    id: 'dispute-001',
    caseNumber: 'CASE-2024-001',
    type: 'damage',
    priority: 'high',
    status: 'open',
    title: 'Cube Display Case Damage',
    description: 'The glass display case in cube C-45 has a crack on the front panel. The damage appears to have occurred during the weekend when the store was closed.',
    category: 'Property Damage',
    subcategory: 'Display Equipment',
    reportedBy: {
      id: 'tenant-003',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      role: 'tenant',
    },
    assignedTo: {
      id: 'agent-001',
      name: 'Store Manager',
      department: 'Operations',
    },
    relatedEntities: [
      {
        type: 'cube',
        id: 'cube-004',
        name: 'C-45',
      },
      {
        type: 'tenant',
        id: 'tenant-003',
        name: 'Emma Davis',
      },
    ],
    timeline: [
      {
        id: 'timeline-001',
        action: 'Case Created',
        description: 'Dispute case created by tenant Emma Davis',
        performedBy: 'tenant-003',
        timestamp: '2024-03-10T09:00:00Z',
        isInternal: false,
      },
      {
        id: 'timeline-002',
        action: 'Case Assigned',
        description: 'Case assigned to Store Manager for investigation',
        performedBy: 'system',
        timestamp: '2024-03-10T09:15:00Z',
        isInternal: true,
      },
      {
        id: 'timeline-003',
        action: 'Investigation Started',
        description: 'Initial investigation and photo documentation completed',
        performedBy: 'agent-001',
        timestamp: '2024-03-10T14:30:00Z',
        isInternal: true,
      },
    ],
    attachments: [
      {
        id: 'attachment-001',
        name: 'cube-c45-damage-photo1.jpg',
        type: 'image',
        url: '/uploads/disputes/cube-c45-damage-photo1.jpg',
        size: 2048576,
        uploadedBy: 'tenant-003',
        uploadedAt: '2024-03-10T09:00:00Z',
      },
      {
        id: 'attachment-002',
        name: 'cube-c45-damage-photo2.jpg',
        type: 'image',
        url: '/uploads/disputes/cube-c45-damage-photo2.jpg',
        size: 1856432,
        uploadedBy: 'agent-001',
        uploadedAt: '2024-03-10T14:30:00Z',
      },
    ],
    comments: [
      {
        id: 'comment-001',
        author: 'Emma Davis',
        message: 'I noticed the crack when I arrived this morning. It wasn\'t there on Friday when I left.',
        timestamp: '2024-03-10T09:05:00Z',
        isInternal: false,
      },
      {
        id: 'comment-002',
        author: 'Store Manager',
        message: 'Investigating the cause. Checking security footage from the weekend.',
        timestamp: '2024-03-10T14:35:00Z',
        isInternal: true,
      },
    ],
    sla: {
      responseTime: 4,
      resolutionTime: 72,
      responseDeadline: '2024-03-10T13:00:00Z',
      resolutionDeadline: '2024-03-13T09:00:00Z',
      isOverdue: false,
    },
    tags: ['damage', 'glass', 'cube', 'urgent'],
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-10T14:35:00Z',
  },
  {
    id: 'dispute-002',
    caseNumber: 'CASE-2024-002',
    type: 'billing',
    priority: 'medium',
    status: 'in_progress',
    title: 'Incorrect Commission Calculation',
    description: 'Tenant reports that the commission calculation for February sales appears to be incorrect. The calculated amount is higher than expected based on the agreed commission rate.',
    category: 'Financial',
    subcategory: 'Commission Dispute',
    reportedBy: {
      id: 'tenant-002',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      role: 'tenant',
    },
    assignedTo: {
      id: 'agent-002',
      name: 'Finance Manager',
      department: 'Finance',
    },
    relatedEntities: [
      {
        type: 'tenant',
        id: 'tenant-002',
        name: 'Mike Chen',
      },
    ],
    timeline: [
      {
        id: 'timeline-004',
        action: 'Case Created',
        description: 'Billing dispute case created by tenant Mike Chen',
        performedBy: 'tenant-002',
        timestamp: '2024-03-08T11:30:00Z',
        isInternal: false,
      },
      {
        id: 'timeline-005',
        action: 'Case Assigned',
        description: 'Case assigned to Finance Manager for review',
        performedBy: 'system',
        timestamp: '2024-03-08T11:45:00Z',
        isInternal: true,
      },
      {
        id: 'timeline-006',
        action: 'Financial Review Started',
        description: 'Started reviewing February sales and commission calculations',
        performedBy: 'agent-002',
        timestamp: '2024-03-08T16:20:00Z',
        isInternal: true,
      },
    ],
    attachments: [
      {
        id: 'attachment-003',
        name: 'february-sales-report.pdf',
        type: 'document',
        url: '/uploads/disputes/february-sales-report.pdf',
        size: 524288,
        uploadedBy: 'tenant-002',
        uploadedAt: '2024-03-08T11:30:00Z',
      },
    ],
    comments: [
      {
        id: 'comment-003',
        author: 'Mike Chen',
        message: 'Based on my records, my February sales were $6,890.50 with a 7.5% commission rate, which should be $516.79, not $545.23 as calculated.',
        timestamp: '2024-03-08T11:35:00Z',
        isInternal: false,
      },
      {
        id: 'comment-004',
        author: 'Finance Manager',
        message: 'Reviewing the calculation. Will provide detailed breakdown by end of week.',
        timestamp: '2024-03-08T16:25:00Z',
        isInternal: false,
      },
    ],
    sla: {
      responseTime: 8,
      resolutionTime: 120,
      responseDeadline: '2024-03-08T19:30:00Z',
      resolutionDeadline: '2024-03-13T11:30:00Z',
      isOverdue: false,
    },
    tags: ['billing', 'commission', 'calculation', 'finance'],
    createdAt: '2024-03-08T11:30:00Z',
    updatedAt: '2024-03-08T16:25:00Z',
  },
  {
    id: 'dispute-003',
    caseNumber: 'CASE-2024-003',
    type: 'complaint',
    priority: 'low',
    status: 'resolved',
    title: 'Customer Service Complaint',
    description: 'Customer complained about rude behavior from a tenant during a purchase interaction. Customer felt unwelcome and left without making a purchase.',
    category: 'Customer Service',
    subcategory: 'Tenant Behavior',
    reportedBy: {
      id: 'customer-001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      role: 'customer',
    },
    assignedTo: {
      id: 'agent-001',
      name: 'Store Manager',
      department: 'Operations',
    },
    relatedEntities: [
      {
        type: 'tenant',
        id: 'tenant-001',
        name: 'Sarah Johnson',
      },
      {
        type: 'customer',
        id: 'customer-001',
        name: 'John Smith',
      },
    ],
    timeline: [
      {
        id: 'timeline-007',
        action: 'Complaint Received',
        description: 'Customer complaint received via email',
        performedBy: 'customer-001',
        timestamp: '2024-03-05T14:20:00Z',
        isInternal: false,
      },
      {
        id: 'timeline-008',
        action: 'Investigation Completed',
        description: 'Spoke with tenant and reviewed the incident',
        performedBy: 'agent-001',
        timestamp: '2024-03-06T10:15:00Z',
        isInternal: true,
      },
      {
        id: 'timeline-009',
        action: 'Resolution Implemented',
        description: 'Tenant counseled on customer service standards, customer contacted with apology',
        performedBy: 'agent-001',
        timestamp: '2024-03-06T16:30:00Z',
        isInternal: false,
      },
    ],
    attachments: [],
    comments: [
      {
        id: 'comment-005',
        author: 'John Smith',
        message: 'The tenant seemed annoyed when I asked questions about the jewelry and made me feel like I was bothering them.',
        timestamp: '2024-03-05T14:25:00Z',
        isInternal: false,
      },
      {
        id: 'comment-006',
        author: 'Store Manager',
        message: 'Discussed customer service expectations with the tenant. They acknowledged the issue and committed to improvement.',
        timestamp: '2024-03-06T16:35:00Z',
        isInternal: true,
      },
    ],
    resolution: {
      summary: 'Tenant was counseled on proper customer service standards and acknowledged the need for improvement. Customer was contacted with a personal apology and invited to return.',
      actions: [
        'Counseled tenant on customer service standards',
        'Provided customer service training materials',
        'Contacted customer with personal apology',
        'Offered customer 10% discount on future purchase',
      ],
      compensation: {
        type: 'other',
        description: '10% discount coupon for future purchase',
      },
      resolvedBy: 'agent-001',
      resolvedAt: '2024-03-06T16:30:00Z',
      satisfactionRating: 4,
      followUpRequired: true,
      followUpDate: '2024-03-20T00:00:00Z',
    },
    sla: {
      responseTime: 4,
      resolutionTime: 48,
      responseDeadline: '2024-03-05T18:20:00Z',
      resolutionDeadline: '2024-03-07T14:20:00Z',
      isOverdue: false,
    },
    tags: ['complaint', 'customer-service', 'resolved', 'tenant-behavior'],
    createdAt: '2024-03-05T14:20:00Z',
    updatedAt: '2024-03-06T16:35:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const disputeId = searchParams.get('id');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const assignedTo = searchParams.get('assignedTo');
    const reportedBy = searchParams.get('reportedBy');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get specific dispute
    if (disputeId) {
      const dispute = mockDisputes.find(d => d.id === disputeId);
      if (!dispute) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'DISPUTE_NOT_FOUND',
              message: 'Dispute not found',
            },
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: dispute,
      });
    }

    // Get dispute statistics
    if (type === 'stats') {
      const stats = {
        total: mockDisputes.length,
        open: mockDisputes.filter(d => d.status === 'open').length,
        inProgress: mockDisputes.filter(d => d.status === 'in_progress').length,
        resolved: mockDisputes.filter(d => d.status === 'resolved').length,
        closed: mockDisputes.filter(d => d.status === 'closed').length,
        escalated: mockDisputes.filter(d => d.status === 'escalated').length,
        overdue: mockDisputes.filter(d => d.sla.isOverdue).length,
        byType: mockDisputes.reduce((acc, d) => {
          acc[d.type] = (acc[d.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byPriority: mockDisputes.reduce((acc, d) => {
          acc[d.priority] = (acc[d.priority] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        averageResolutionTime: 48, // hours - would be calculated from resolved disputes
        satisfactionRating: 4.2, // average from resolved disputes with ratings
      };
      
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    // Get dispute categories
    if (type === 'categories') {
      const categories = [...new Set(mockDisputes.map(d => d.category))];
      const subcategories = mockDisputes.reduce((acc, d) => {
        if (d.subcategory) {
          if (!acc[d.category]) acc[d.category] = [];
          if (!acc[d.category].includes(d.subcategory)) {
            acc[d.category].push(d.subcategory);
          }
        }
        return acc;
      }, {} as Record<string, string[]>);
      
      return NextResponse.json({
        success: true,
        data: {
          categories,
          subcategories,
        },
      });
    }

    // Filter disputes
    let filteredDisputes = mockDisputes;

    if (type && type !== 'all') {
      filteredDisputes = filteredDisputes.filter(d => d.type === type);
    }

    if (status) {
      filteredDisputes = filteredDisputes.filter(d => d.status === status);
    }

    if (priority) {
      filteredDisputes = filteredDisputes.filter(d => d.priority === priority);
    }

    if (category) {
      filteredDisputes = filteredDisputes.filter(d => d.category === category);
    }

    if (assignedTo) {
      filteredDisputes = filteredDisputes.filter(d => d.assignedTo?.id === assignedTo);
    }

    if (reportedBy) {
      filteredDisputes = filteredDisputes.filter(d => d.reportedBy.id === reportedBy);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredDisputes = filteredDisputes.filter(d => 
        d.title.toLowerCase().includes(searchLower) ||
        d.description.toLowerCase().includes(searchLower) ||
        d.caseNumber.toLowerCase().includes(searchLower) ||
        d.reportedBy.name.toLowerCase().includes(searchLower) ||
        d.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by creation date (newest first) and priority
    filteredDisputes.sort((a, b) => {
      const priorityOrder = { critical: 5, urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDisputes = filteredDisputes.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedDisputes,
      meta: {
        page,
        limit,
        total: filteredDisputes.length,
        hasMore: endIndex < filteredDisputes.length,
      },
    });
  } catch (error) {
    console.error('Disputes API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DISPUTES_ERROR',
          message: 'Failed to fetch disputes data',
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
      case 'create-dispute':
        // In production, this would create a new dispute in the database
        const newDispute: DisputeCase = {
          id: `dispute-${Date.now()}`,
          caseNumber: `CASE-${new Date().getFullYear()}-${String(mockDisputes.length + 1).padStart(3, '0')}`,
          status: 'open',
          timeline: [
            {
              id: `timeline-${Date.now()}`,
              action: 'Case Created',
              description: `Dispute case created by ${data.reportedBy.name}`,
              performedBy: data.reportedBy.id,
              timestamp: new Date().toISOString(),
              isInternal: false,
            },
          ],
          attachments: [],
          comments: [],
          sla: {
            responseTime: data.priority === 'critical' ? 1 : data.priority === 'urgent' ? 2 : data.priority === 'high' ? 4 : 8,
            resolutionTime: data.priority === 'critical' ? 24 : data.priority === 'urgent' ? 48 : data.priority === 'high' ? 72 : 120,
            responseDeadline: new Date(Date.now() + (data.priority === 'critical' ? 1 : data.priority === 'urgent' ? 2 : data.priority === 'high' ? 4 : 8) * 60 * 60 * 1000).toISOString(),
            resolutionDeadline: new Date(Date.now() + (data.priority === 'critical' ? 24 : data.priority === 'urgent' ? 48 : data.priority === 'high' ? 72 : 120) * 60 * 60 * 1000).toISOString(),
            isOverdue: false,
          },
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return NextResponse.json({
          success: true,
          data: newDispute,
          message: 'Dispute created successfully',
        });

      case 'update-dispute':
        const { disputeId, updates } = data;
        // In production, this would update the dispute in the database
        return NextResponse.json({
          success: true,
          data: { id: disputeId, ...updates, updatedAt: new Date().toISOString() },
          message: 'Dispute updated successfully',
        });

      case 'assign-dispute':
        const { disputeId: assignDisputeId, assignedTo } = data;
        // In production, this would assign the dispute and add timeline entry
        return NextResponse.json({
          success: true,
          message: 'Dispute assigned successfully',
        });

      case 'update-status':
        const { disputeId: statusDisputeId, status, reason } = data;
        // In production, this would update status and add timeline entry
        return NextResponse.json({
          success: true,
          message: `Dispute status updated to ${status}`,
        });

      case 'add-comment':
        const { disputeId: commentDisputeId, comment } = data;
        // In production, this would add comment to the dispute
        const newComment = {
          id: `comment-${Date.now()}`,
          author: comment.author,
          message: comment.message,
          timestamp: new Date().toISOString(),
          isInternal: comment.isInternal || false,
          attachments: comment.attachments || [],
        };
        
        return NextResponse.json({
          success: true,
          data: newComment,
          message: 'Comment added successfully',
        });

      case 'add-attachment':
        const { disputeId: attachDisputeId, attachment } = data;
        // In production, this would upload and attach file to the dispute
        const newAttachment = {
          id: `attachment-${Date.now()}`,
          name: attachment.name,
          type: attachment.type,
          url: `/uploads/disputes/${attachment.name}`,
          size: attachment.size,
          uploadedBy: attachment.uploadedBy,
          uploadedAt: new Date().toISOString(),
        };
        
        return NextResponse.json({
          success: true,
          data: newAttachment,
          message: 'Attachment added successfully',
        });

      case 'resolve-dispute':
        const { disputeId: resolveDisputeId, resolution } = data;
        // In production, this would resolve the dispute and add resolution details
        return NextResponse.json({
          success: true,
          message: 'Dispute resolved successfully',
        });

      case 'escalate-dispute':
        const { disputeId: escalateDisputeId, escalationReason } = data;
        // In production, this would escalate the dispute
        return NextResponse.json({
          success: true,
          message: 'Dispute escalated successfully',
        });

      case 'bulk-update':
        const { disputeIds, bulkUpdates } = data;
        // In production, this would update multiple disputes
        return NextResponse.json({
          success: true,
          message: `${disputeIds.length} disputes updated successfully`,
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
    console.error('Disputes POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DISPUTES_POST_ERROR',
          message: 'Failed to process dispute action',
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
            message: 'Dispute ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would update the dispute in the database
    return NextResponse.json({
      success: true,
      data: { id, ...updates, updatedAt: new Date().toISOString() },
      message: 'Dispute updated successfully',
    });
  } catch (error) {
    console.error('Disputes PUT API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DISPUTES_PUT_ERROR',
          message: 'Failed to update dispute',
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
    const disputeId = searchParams.get('id');

    if (!disputeId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_ID',
            message: 'Dispute ID is required',
          },
        },
        { status: 400 }
      );
    }

    // In production, this would soft delete the dispute in the database
    return NextResponse.json({
      success: true,
      message: 'Dispute deleted successfully',
    });
  } catch (error) {
    console.error('Disputes DELETE API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DISPUTES_DELETE_ERROR',
          message: 'Failed to delete dispute',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}