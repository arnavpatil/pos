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
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  MoreVertical,
  Download,
  Send,
  Truck,
  CalendarDays,
  Timer,
  Users
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Reservation {
  id: string;
  reservationNumber: string;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled' | 'no_show';
  type: 'pickup' | 'delivery' | 'appointment';
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  tenant: {
    id: string;
    name: string;
    cubeName: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    sku?: string;
  }>;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number; // in minutes
  actualPickupTime?: string;
  notes?: string;
  specialInstructions?: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
  reminderSent: boolean;
  confirmationSent: boolean;
}

interface ReservationFormData {
  type: 'pickup' | 'delivery' | 'appointment';
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tenantId: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  notes?: string;
  specialInstructions?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    sku?: string;
  }>;
}

interface TimeSlot {
  time: string;
  available: boolean;
  reserved?: number;
  capacity: number;
}

const ReservationSystem = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewingReservation, setViewingReservation] = useState<Reservation | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [formData, setFormData] = useState<ReservationFormData>({
    type: 'pickup',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    tenantId: '',
    scheduledDate: '',
    scheduledTime: '',
    estimatedDuration: 30,
    items: [],
  });

  useEffect(() => {
    fetchReservations();
    generateTimeSlots();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [reservations, searchTerm, statusFilter, typeFilter, dateFilter]);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockReservations: Reservation[] = [
        {
          id: '1',
          reservationNumber: 'RES-2024-001',
          status: 'confirmed',
          type: 'pickup',
          customer: {
            id: 'cust_001',
            name: 'Alice Johnson',
            email: 'alice@email.com',
            phone: '+1-555-0123',
          },
          tenant: {
            id: 'tenant_001',
            name: 'Sarah\'s Art Studio',
            cubeName: 'Cube A12',
          },
          items: [
            {
              id: 'item_001',
              name: 'Handmade Ceramic Vase',
              quantity: 1,
              price: 85.00,
              sku: 'VASE-001',
            },
            {
              id: 'item_002',
              name: 'Art Print Set',
              quantity: 3,
              price: 45.00,
              sku: 'PRINT-SET-001',
            },
          ],
          scheduledDate: '2024-03-16',
          scheduledTime: '14:00',
          estimatedDuration: 30,
          notes: 'Customer prefers afternoon pickup',
          specialInstructions: 'Handle ceramic items with extra care',
          totalAmount: 220.00,
          paymentStatus: 'paid',
          createdAt: '2024-03-15T10:30:00Z',
          updatedAt: '2024-03-15T14:20:00Z',
          reminderSent: true,
          confirmationSent: true,
        },
        {
          id: '2',
          reservationNumber: 'RES-2024-002',
          status: 'pending',
          type: 'pickup',
          customer: {
            id: 'cust_002',
            name: 'Bob Smith',
            email: 'bob@email.com',
            phone: '+1-555-0124',
          },
          tenant: {
            id: 'tenant_002',
            name: 'Mike\'s Jewelry',
            cubeName: 'Cube B05',
          },
          items: [
            {
              id: 'item_003',
              name: 'Silver Necklace',
              quantity: 1,
              price: 120.00,
              sku: 'NECK-SIL-001',
            },
          ],
          scheduledDate: '2024-03-17',
          scheduledTime: '11:00',
          estimatedDuration: 15,
          totalAmount: 120.00,
          paymentStatus: 'pending',
          createdAt: '2024-03-15T16:45:00Z',
          updatedAt: '2024-03-15T16:45:00Z',
          reminderSent: false,
          confirmationSent: false,
        },
        {
          id: '3',
          reservationNumber: 'RES-2024-003',
          status: 'ready',
          type: 'pickup',
          customer: {
            id: 'cust_003',
            name: 'Carol Davis',
            email: 'carol@email.com',
            phone: '+1-555-0125',
          },
          tenant: {
            id: 'tenant_003',
            name: 'Emma\'s Crafts',
            cubeName: 'Cube C08',
          },
          items: [
            {
              id: 'item_004',
              name: 'Knitted Scarf',
              quantity: 2,
              price: 35.00,
              sku: 'SCARF-001',
            },
            {
              id: 'item_005',
              name: 'Handmade Soap Set',
              quantity: 1,
              price: 25.00,
              sku: 'SOAP-SET-001',
            },
          ],
          scheduledDate: '2024-03-15',
          scheduledTime: '16:30',
          estimatedDuration: 20,
          actualPickupTime: '2024-03-15T16:35:00Z',
          totalAmount: 95.00,
          paymentStatus: 'paid',
          createdAt: '2024-03-14T09:15:00Z',
          updatedAt: '2024-03-15T16:35:00Z',
          reminderSent: true,
          confirmationSent: true,
        },
        {
          id: '4',
          reservationNumber: 'RES-2024-004',
          status: 'completed',
          type: 'delivery',
          customer: {
            id: 'cust_004',
            name: 'David Wilson',
            email: 'david@email.com',
            phone: '+1-555-0126',
          },
          tenant: {
            id: 'tenant_001',
            name: 'Sarah\'s Art Studio',
            cubeName: 'Cube A12',
          },
          items: [
            {
              id: 'item_006',
              name: 'Large Canvas Painting',
              quantity: 1,
              price: 350.00,
              sku: 'PAINT-LRG-001',
            },
          ],
          scheduledDate: '2024-03-14',
          scheduledTime: '10:00',
          estimatedDuration: 45,
          actualPickupTime: '2024-03-14T10:15:00Z',
          notes: 'Delivery to downtown office',
          specialInstructions: 'Use freight elevator, 15th floor',
          totalAmount: 350.00,
          paymentStatus: 'paid',
          createdAt: '2024-03-12T14:20:00Z',
          updatedAt: '2024-03-14T11:00:00Z',
          reminderSent: true,
          confirmationSent: true,
        },
        {
          id: '5',
          reservationNumber: 'RES-2024-005',
          status: 'no_show',
          type: 'pickup',
          customer: {
            id: 'cust_005',
            name: 'Eva Martinez',
            email: 'eva@email.com',
            phone: '+1-555-0127',
          },
          tenant: {
            id: 'tenant_004',
            name: 'Tom\'s Woodwork',
            cubeName: 'Cube D15',
          },
          items: [
            {
              id: 'item_007',
              name: 'Wooden Picture Frame',
              quantity: 4,
              price: 30.00,
              sku: 'FRAME-WD-001',
            },
          ],
          scheduledDate: '2024-03-13',
          scheduledTime: '13:00',
          estimatedDuration: 25,
          totalAmount: 120.00,
          paymentStatus: 'paid',
          createdAt: '2024-03-11T11:30:00Z',
          updatedAt: '2024-03-13T13:30:00Z',
          reminderSent: true,
          confirmationSent: true,
        },
      ];

      setReservations(mockReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 18; // 6 PM
    const slotDuration = 30; // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const reserved = reservations.filter(
          r => r.scheduledDate === selectedDate && r.scheduledTime === time && r.status !== 'cancelled'
        ).length;
        
        slots.push({
          time,
          available: reserved < 3, // Max 3 reservations per slot
          reserved,
          capacity: 3,
        });
      }
    }
    
    setTimeSlots(slots);
  };

  const filterReservations = () => {
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter(
        (reservation) =>
          reservation.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((reservation) => reservation.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((reservation) => reservation.type === typeFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter((reservation) => reservation.scheduledDate === dateFilter);
    }

    setFilteredReservations(filtered);
  };

  const handleAddReservation = async () => {
    try {
      const totalAmount = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const newReservation: Reservation = {
        id: Date.now().toString(),
        reservationNumber: `RES-2024-${String(reservations.length + 1).padStart(3, '0')}`,
        status: 'pending',
        type: formData.type,
        customer: {
          id: formData.customerId || `cust_${Date.now()}`,
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
        },
        tenant: {
          id: formData.tenantId,
          name: 'Selected Tenant', // This would come from tenant lookup
          cubeName: 'Cube Name', // This would come from tenant lookup
        },
        items: formData.items.map((item, index) => ({
          id: `item_${Date.now()}_${index}`,
          ...item,
        })),
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        estimatedDuration: formData.estimatedDuration,
        notes: formData.notes,
        specialInstructions: formData.specialInstructions,
        totalAmount,
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reminderSent: false,
        confirmationSent: false,
      };

      setReservations((prev) => [newReservation, ...prev]);
      setShowAddForm(false);
      resetForm();
      alert('Reservation created successfully!');
    } catch (error) {
      console.error('Error adding reservation:', error);
      alert('Failed to create reservation');
    }
  };

  const handleStatusUpdate = async (reservationId: string, newStatus: string) => {
    try {
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === reservationId
            ? { 
                ...reservation, 
                status: newStatus as any, 
                updatedAt: new Date().toISOString(),
                actualPickupTime: newStatus === 'completed' ? new Date().toISOString() : reservation.actualPickupTime
              }
            : reservation
        )
      );
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleSendReminder = async (reservationId: string) => {
    try {
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, reminderSent: true, updatedAt: new Date().toISOString() }
            : reservation
        )
      );
      alert('Reminder sent successfully!');
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Failed to send reminder');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'pickup',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      tenantId: '',
      scheduledDate: '',
      scheduledTime: '',
      estimatedDuration: 30,
      items: [],
    });
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      ready: { color: 'bg-green-100 text-green-800', icon: Package },
      completed: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
      no_show: { color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;
    
    return (
      <Badge className={config?.color || 'bg-gray-100 text-gray-800'}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      pickup: 'bg-blue-100 text-blue-800',
      delivery: 'bg-green-100 text-green-800',
      appointment: 'bg-purple-100 text-purple-800',
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
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}:00`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
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
        <h2 className="text-2xl font-bold">Reservation System</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Reservation
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">All Reservations</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
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
                    placeholder="Search reservations..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pickup">Pickup</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-48"
                />
              </div>
            </CardContent>
          </Card>

          {/* Reservations List */}
          <div className="space-y-4">
            {filteredReservations.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No reservations found</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredReservations.map((reservation) => (
                <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-lg">
                            {reservation.reservationNumber}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {formatDate(reservation.scheduledDate)} at {formatTime(reservation.scheduledTime)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          {getStatusBadge(reservation.status)}
                          {getTypeBadge(reservation.type)}
                          <Badge variant="outline">
                            {formatCurrency(reservation.totalAmount)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Customer</p>
                            <p className="text-gray-600">{reservation.customer.name}</p>
                            <p className="text-gray-500">{reservation.customer.email}</p>
                          </div>
                          <div>
                            <p className="font-medium">Tenant</p>
                            <p className="text-gray-600">{reservation.tenant.name}</p>
                            <p className="text-gray-500">{reservation.tenant.cubeName}</p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm font-medium">Items ({reservation.items.length})</p>
                          <div className="text-xs text-gray-500">
                            {reservation.items.slice(0, 2).map((item, index) => (
                              <span key={index}>
                                {item.name} (x{item.quantity})
                                {index < Math.min(reservation.items.length, 2) - 1 && ', '}
                              </span>
                            ))}
                            {reservation.items.length > 2 && (
                              <span> +{reservation.items.length - 2} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingReservation(reservation)}
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
                            <DropdownMenuItem onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}>
                              Confirm
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(reservation.id, 'ready')}>
                              Mark Ready
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(reservation.id, 'completed')}>
                              Complete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendReminder(reservation.id)}>
                              Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}>
                              Cancel
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

        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Schedule</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-48"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {timeSlots.map((slot) => {
                      const slotReservations = reservations.filter(
                        r => r.scheduledDate === selectedDate && r.scheduledTime === slot.time && r.status !== 'cancelled'
                      );
                      
                      return (
                        <div key={slot.time} className={`p-3 border rounded flex items-center justify-between ${
                          slot.available ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{formatTime(slot.time)}</span>
                            <Badge variant={slot.available ? 'default' : 'destructive'}>
                              {slot.reserved}/{slot.capacity}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {slotReservations.length > 0 && (
                              <span>
                                {slotReservations.map(r => r.customer.name).join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Today's Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Reservations</span>
                      <span className="font-medium">
                        {reservations.filter(r => r.scheduledDate === new Date().toISOString().split('T')[0]).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pending</span>
                      <span className="font-medium text-yellow-600">
                        {reservations.filter(r => r.scheduledDate === new Date().toISOString().split('T')[0] && r.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Confirmed</span>
                      <span className="font-medium text-blue-600">
                        {reservations.filter(r => r.scheduledDate === new Date().toISOString().split('T')[0] && r.status === 'confirmed').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completed</span>
                      <span className="font-medium text-green-600">
                        {reservations.filter(r => r.scheduledDate === new Date().toISOString().split('T')[0] && r.status === 'completed').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reservations.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {reservations.filter(r => {
                    const reservationDate = new Date(r.scheduledDate);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return reservationDate >= weekAgo;
                  }).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {reservations.length > 0 ? 
                    Math.round((reservations.filter(r => r.status === 'completed').length / reservations.length) * 100) : 0
                  }%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">No-Show Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {reservations.length > 0 ? 
                    Math.round((reservations.filter(r => r.status === 'no_show').length / reservations.length) * 100) : 0
                  }%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reservations by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['pickup', 'delivery', 'appointment'].map((type) => {
                    const count = reservations.filter(r => r.type === type).length;
                    const percentage = reservations.length > 0 ? (count / reservations.length) * 100 : 0;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeBadge(type)}
                          <span className="text-sm">{count} reservations</span>
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
                <CardTitle>Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['pending', 'confirmed', 'ready', 'completed', 'cancelled', 'no_show'].map((status) => {
                    const count = reservations.filter(r => r.status === status).length;
                    const percentage = reservations.length > 0 ? (count / reservations.length) * 100 : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(status)}
                          <span className="text-sm">{count} reservations</span>
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
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Reservation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduledDate">Date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="scheduledTime">Time</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Customer full name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="customer@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="+1-555-0123"
                  />
                </div>
                <div>
                  <Label htmlFor="tenantId">Tenant</Label>
                  <Select value={formData.tenantId} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, tenantId: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tenant_001">Sarah's Art Studio - Cube A12</SelectItem>
                      <SelectItem value="tenant_002">Mike's Jewelry - Cube B05</SelectItem>
                      <SelectItem value="tenant_003">Emma's Crafts - Cube C08</SelectItem>
                      <SelectItem value="tenant_004">Tom's Woodwork - Cube D15</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
                <Input
                  id="estimatedDuration"
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 30 }))}
                  placeholder="30"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                          placeholder="Item name"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          placeholder="Qty"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="Price"
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    placeholder="Special handling instructions"
                    rows={3}
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
                <Button onClick={handleAddReservation}>
                  Create Reservation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Reservation Modal */}
      {viewingReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{viewingReservation.reservationNumber}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(viewingReservation.scheduledDate)} at {formatTime(viewingReservation.scheduledTime)}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setViewingReservation(null)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                {getStatusBadge(viewingReservation.status)}
                {getTypeBadge(viewingReservation.type)}
                <Badge variant="outline">
                  {formatCurrency(viewingReservation.totalAmount)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><User className="w-4 h-4 inline mr-2" />{viewingReservation.customer.name}</p>
                    <p><Mail className="w-4 h-4 inline mr-2" />{viewingReservation.customer.email}</p>
                    <p><Phone className="w-4 h-4 inline mr-2" />{viewingReservation.customer.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Tenant Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><MapPin className="w-4 h-4 inline mr-2" />{viewingReservation.tenant.name}</p>
                    <p className="ml-6">{viewingReservation.tenant.cubeName}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Items ({viewingReservation.items.length})</h4>
                <div className="space-y-2">
                  {viewingReservation.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        {item.sku && <span className="text-xs text-gray-500 ml-2">SKU: {item.sku}</span>}
                      </div>
                      <div className="text-right">
                        <div className="text-sm">Qty: {item.quantity}</div>
                        <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {(viewingReservation.notes || viewingReservation.specialInstructions) && (
                <div className="grid grid-cols-2 gap-6">
                  {viewingReservation.notes && (
                    <div>
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-sm text-gray-600">{viewingReservation.notes}</p>
                    </div>
                  )}
                  {viewingReservation.specialInstructions && (
                    <div>
                      <h4 className="font-medium mb-2">Special Instructions</h4>
                      <p className="text-sm text-gray-600">{viewingReservation.specialInstructions}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t pt-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Created:</span>
                    <p className="text-gray-600">{formatDate(viewingReservation.createdAt)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>
                    <p className="text-gray-600">{viewingReservation.estimatedDuration} minutes</p>
                  </div>
                  <div>
                    <span className="font-medium">Payment:</span>
                    <p className="text-gray-600">
                      {viewingReservation.paymentStatus.charAt(0).toUpperCase() + viewingReservation.paymentStatus.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReservationSystem;