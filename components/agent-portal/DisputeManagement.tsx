'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Plus, 
  Edit, 
  Eye, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Camera,
  FileText,
  DollarSign,
  Calendar,
  User,
  Search,
  Filter,
  MoreVertical,
  Upload
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Dispute {
  id: string;
  ticketNumber: string;
  type: 'damage' | 'dispute' | 'complaint' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  title: string;
  description: string;
  reportedBy: {
    id: string;
    name: string;
    email: string;
    role: 'tenant' | 'agent' | 'customer';
  };
  relatedEntity?: {
    type: 'cube' | 'product' | 'transaction';
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  estimatedCost?: number;
  actualCost?: number;
  attachments: Array<{
    id: string;
    name: string;
    type: 'image' | 'document';
    url: string;
    uploadedAt: string;
  }>;
  comments: Array<{
    id: string;
    author: string;
    message: string;
    timestamp: string;
    isInternal: boolean;
  }>;
  resolution?: {
    summary: string;
    actions: string[];
    resolvedBy: string;
    resolvedAt: string;
  };
}

interface DisputeFormData {
  type: 'damage' | 'dispute' | 'complaint' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  relatedEntityType?: 'cube' | 'product' | 'transaction';
  relatedEntityId?: string;
  estimatedCost?: number;
  dueDate?: string;
}

const DisputeManagement = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [filteredDisputes, setFilteredDisputes] = useState<Dispute[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewingDispute, setViewingDispute] = useState<Dispute | null>(null);
  const [formData, setFormData] = useState<DisputeFormData>({
    type: 'damage',
    priority: 'medium',
    title: '',
    description: '',
    estimatedCost: 0,
  });
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchDisputes();
  }, []);

  useEffect(() => {
    filterDisputes();
  }, [disputes, searchTerm, statusFilter, typeFilter, priorityFilter]);

  const fetchDisputes = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockDisputes: Dispute[] = [
        {
          id: '1',
          ticketNumber: 'DSP-2024-001',
          type: 'damage',
          priority: 'high',
          status: 'open',
          title: 'Broken Display Case in Cube A12',
          description: 'The glass display case in cube A12 has been damaged. The front panel is cracked and needs replacement.',
          reportedBy: {
            id: 'tenant_001',
            name: 'Sarah Johnson',
            email: 'sarah@email.com',
            role: 'tenant',
          },
          relatedEntity: {
            type: 'cube',
            id: 'cube_a12',
            name: 'Cube A12',
          },
          assignedTo: {
            id: 'agent_001',
            name: 'John Smith',
          },
          createdAt: '2024-03-15T10:30:00Z',
          updatedAt: '2024-03-15T14:20:00Z',
          dueDate: '2024-03-20T17:00:00Z',
          estimatedCost: 250.00,
          attachments: [
            {
              id: 'att_001',
              name: 'damage_photo_1.jpg',
              type: 'image',
              url: '/uploads/damage_photo_1.jpg',
              uploadedAt: '2024-03-15T10:35:00Z',
            },
          ],
          comments: [
            {
              id: 'comm_001',
              author: 'Sarah Johnson',
              message: 'The damage occurred during setup. I noticed it this morning.',
              timestamp: '2024-03-15T10:35:00Z',
              isInternal: false,
            },
            {
              id: 'comm_002',
              author: 'John Smith',
              message: 'I\'ll contact the glass repair service for a quote.',
              timestamp: '2024-03-15T14:20:00Z',
              isInternal: true,
            },
          ],
        },
        {
          id: '2',
          ticketNumber: 'DSP-2024-002',
          type: 'dispute',
          priority: 'medium',
          status: 'in_progress',
          title: 'Commission Rate Disagreement',
          description: 'Tenant disputes the commission rate applied to recent sales. Claims it should be 10% instead of 15%.',
          reportedBy: {
            id: 'tenant_003',
            name: 'Mike Chen',
            email: 'mike@email.com',
            role: 'tenant',
          },
          assignedTo: {
            id: 'agent_002',
            name: 'Jane Doe',
          },
          createdAt: '2024-03-14T09:15:00Z',
          updatedAt: '2024-03-15T11:30:00Z',
          dueDate: '2024-03-18T17:00:00Z',
          attachments: [
            {
              id: 'att_002',
              name: 'contract_copy.pdf',
              type: 'document',
              url: '/uploads/contract_copy.pdf',
              uploadedAt: '2024-03-14T09:20:00Z',
            },
          ],
          comments: [
            {
              id: 'comm_003',
              author: 'Mike Chen',
              message: 'According to my contract, the commission should be 10% for sales over $500.',
              timestamp: '2024-03-14T09:20:00Z',
              isInternal: false,
            },
            {
              id: 'comm_004',
              author: 'Jane Doe',
              message: 'Reviewing the contract terms. Will get back with clarification.',
              timestamp: '2024-03-15T11:30:00Z',
              isInternal: false,
            },
          ],
        },
        {
          id: '3',
          ticketNumber: 'DSP-2024-003',
          type: 'complaint',
          priority: 'low',
          status: 'resolved',
          title: 'Noise Complaint from Adjacent Cube',
          description: 'Customer complained about noise from construction work in adjacent cube during business hours.',
          reportedBy: {
            id: 'customer_001',
            name: 'Alice Brown',
            email: 'alice@email.com',
            role: 'customer',
          },
          relatedEntity: {
            type: 'cube',
            id: 'cube_b05',
            name: 'Cube B05',
          },
          assignedTo: {
            id: 'agent_001',
            name: 'John Smith',
          },
          createdAt: '2024-03-12T14:45:00Z',
          updatedAt: '2024-03-13T16:20:00Z',
          dueDate: '2024-03-15T17:00:00Z',
          attachments: [],
          comments: [
            {
              id: 'comm_005',
              author: 'Alice Brown',
              message: 'The hammering and drilling is very disruptive to the shopping experience.',
              timestamp: '2024-03-12T14:50:00Z',
              isInternal: false,
            },
          ],
          resolution: {
            summary: 'Coordinated with tenant to schedule construction work after business hours.',
            actions: ['Contacted tenant', 'Rescheduled construction', 'Followed up with customer'],
            resolvedBy: 'John Smith',
            resolvedAt: '2024-03-13T16:20:00Z',
          },
        },
        {
          id: '4',
          ticketNumber: 'DSP-2024-004',
          type: 'maintenance',
          priority: 'urgent',
          status: 'open',
          title: 'Electrical Issue in Section C',
          description: 'Power outage affecting multiple cubes in Section C. Needs immediate attention.',
          reportedBy: {
            id: 'agent_001',
            name: 'John Smith',
            email: 'john@email.com',
            role: 'agent',
          },
          createdAt: '2024-03-15T16:00:00Z',
          updatedAt: '2024-03-15T16:00:00Z',
          dueDate: '2024-03-15T20:00:00Z',
          estimatedCost: 500.00,
          attachments: [],
          comments: [],
        },
      ];

      setDisputes(mockDisputes);
    } catch (error) {
      console.error('Error fetching disputes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDisputes = () => {
    let filtered = disputes;

    if (searchTerm) {
      filtered = filtered.filter(
        (dispute) =>
          dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dispute.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dispute.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((dispute) => dispute.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((dispute) => dispute.type === typeFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((dispute) => dispute.priority === priorityFilter);
    }

    setFilteredDisputes(filtered);
  };

  const handleAddDispute = async () => {
    try {
      const newDispute: Dispute = {
        id: Date.now().toString(),
        ticketNumber: `DSP-2024-${String(disputes.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'open',
        reportedBy: {
          id: 'agent_001',
          name: 'Current Agent',
          email: 'agent@email.com',
          role: 'agent',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attachments: [],
        comments: [],
      };

      setDisputes((prev) => [newDispute, ...prev]);
      setShowAddForm(false);
      resetForm();
      alert('Dispute created successfully!');
    } catch (error) {
      console.error('Error adding dispute:', error);
      alert('Failed to create dispute');
    }
  };

  const handleStatusUpdate = async (disputeId: string, newStatus: string) => {
    try {
      setDisputes((prev) =>
        prev.map((dispute) =>
          dispute.id === disputeId
            ? { ...dispute, status: newStatus as any, updatedAt: new Date().toISOString() }
            : dispute
        )
      );
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleAddComment = async (disputeId: string) => {
    if (!newComment.trim()) return;

    try {
      const comment = {
        id: Date.now().toString(),
        author: 'Current Agent',
        message: newComment,
        timestamp: new Date().toISOString(),
        isInternal: false,
      };

      setDisputes((prev) =>
        prev.map((dispute) =>
          dispute.id === disputeId
            ? {
                ...dispute,
                comments: [...dispute.comments, comment],
                updatedAt: new Date().toISOString(),
              }
            : dispute
        )
      );
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'damage',
      priority: 'medium',
      title: '',
      description: '',
      estimatedCost: 0,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      closed: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || AlertTriangle;
    
    return (
      <Badge className={config?.color || 'bg-gray-100 text-gray-800'}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return (
      <Badge className={colors[priority as keyof typeof colors]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      damage: 'bg-red-100 text-red-800',
      dispute: 'bg-yellow-100 text-yellow-800',
      complaint: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-purple-100 text-purple-800',
    };
    return (
      <Badge className={colors[type as keyof typeof colors]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dispute Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Dispute
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">All Disputes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search disputes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="damage">Damage</SelectItem>
                    <SelectItem value="dispute">Dispute</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Disputes List */}
          <div className="space-y-4">
            {filteredDisputes.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No disputes found</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredDisputes.map((dispute) => (
                <Card key={dispute.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-lg">{dispute.title}</h4>
                          <span className="text-sm text-gray-500">#{dispute.ticketNumber}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          {getStatusBadge(dispute.status)}
                          {getTypeBadge(dispute.type)}
                          {getPriorityBadge(dispute.priority)}
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {dispute.description}
                        </p>

                        <div className="flex items-center space-x-6 text-xs text-gray-500">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {dispute.reportedBy.name}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(dispute.createdAt)}
                          </span>
                          {dispute.estimatedCost && (
                            <span className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {formatCurrency(dispute.estimatedCost)}
                            </span>
                          )}
                          {dispute.comments.length > 0 && (
                            <span className="flex items-center">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              {dispute.comments.length} comments
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingDispute(dispute)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(dispute.id, 'in_progress')}>
                              Mark In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(dispute.id, 'resolved')}>
                              Mark Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(dispute.id, 'closed')}>
                              Close Dispute
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{disputes.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Open</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {disputes.filter(d => d.status === 'open').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {disputes.filter(d => d.status === 'in_progress').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {disputes.filter(d => d.status === 'resolved').length}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Disputes by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['damage', 'dispute', 'complaint', 'maintenance'].map((type) => {
                    const count = disputes.filter(d => d.type === type).length;
                    const percentage = (count / disputes.length) * 100;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeBadge(type)}
                          <span className="text-sm">{count} disputes</span>
                        </div>
                        <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['urgent', 'high', 'medium', 'low'].map((priority) => {
                    const count = disputes.filter(d => d.priority === priority).length;
                    const percentage = (count / disputes.length) * 100;
                    return (
                      <div key={priority} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getPriorityBadge(priority)}
                          <span className="text-sm">{count} disputes</span>
                        </div>
                        <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Dispute</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="damage">Damage</SelectItem>
                      <SelectItem value="dispute">Dispute</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: any) => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the issue"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddDispute}>
                  Create Dispute
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Dispute Modal */}
      {viewingDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{viewingDispute.title}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">#{viewingDispute.ticketNumber}</p>
                </div>
                <Button variant="ghost" onClick={() => setViewingDispute(null)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                {getStatusBadge(viewingDispute.status)}
                {getTypeBadge(viewingDispute.type)}
                {getPriorityBadge(viewingDispute.priority)}
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{viewingDispute.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Reported By</h4>
                  <p className="text-sm">
                    {viewingDispute.reportedBy.name}<br />
                    <span className="text-gray-500">{viewingDispute.reportedBy.email}</span>
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Created</h4>
                  <p className="text-sm">{formatDate(viewingDispute.createdAt)}</p>
                </div>
              </div>

              {viewingDispute.attachments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {viewingDispute.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center space-x-2 p-2 border rounded">
                        {attachment.type === 'image' ? (
                          <Camera className="w-4 h-4 text-gray-500" />
                        ) : (
                          <FileText className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="text-sm">{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Comments</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {viewingDispute.comments.map((comment) => (
                    <div key={comment.id} className="p-3 border rounded">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{comment.message}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2 mt-3">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(viewingDispute.id);
                      }
                    }}
                  />
                  <Button onClick={() => handleAddComment(viewingDispute.id)}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {viewingDispute.resolution && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Resolution</h4>
                  <p className="text-sm text-gray-600 mb-2">{viewingDispute.resolution.summary}</p>
                  <p className="text-xs text-gray-500">
                    Resolved by {viewingDispute.resolution.resolvedBy} on {formatDate(viewingDispute.resolution.resolvedAt)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DisputeManagement;