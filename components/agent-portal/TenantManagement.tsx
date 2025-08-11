'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  cubeNumber: string;
  rentAmount: number;
  rentDueDate: string;
  status: 'active' | 'inactive' | 'pending' | 'overdue';
  joinDate: string;
  productCategories: string[];
  totalSales: number;
  commission: number;
  notes: string;
}

interface CubeAssignment {
  cubeId: string;
  cubeNumber: string;
  size: string;
  location: string;
  rentPrice: number;
  status: 'available' | 'occupied' | 'maintenance';
  tenantId?: string;
  tenantName?: string;
}

const TenantManagement = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [cubes, setCubes] = useState<CubeAssignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newTenant, setNewTenant] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    cubeNumber: '',
    rentAmount: 0,
    productCategories: '',
    notes: '',
  });

  useEffect(() => {
    fetchTenants();
    fetchCubes();
  }, []);

  const fetchTenants = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTenants: Tenant[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@artgallery.com',
          phone: '+1-555-0123',
          businessName: 'Sarah\'s Art Gallery',
          cubeNumber: 'A12',
          rentAmount: 450,
          rentDueDate: '2024-02-15',
          status: 'active',
          joinDate: '2023-08-15',
          productCategories: ['Paintings', 'Sculptures'],
          totalSales: 12500,
          commission: 15,
          notes: 'Excellent tenant, always pays on time',
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike@handmadecrafts.com',
          phone: '+1-555-0124',
          businessName: 'Handmade Crafts Co.',
          cubeNumber: 'B05',
          rentAmount: 380,
          rentDueDate: '2024-02-10',
          status: 'overdue',
          joinDate: '2023-06-20',
          productCategories: ['Crafts', 'Jewelry'],
          totalSales: 8750,
          commission: 12,
          notes: 'Payment reminder sent',
        },
        {
          id: '3',
          name: 'Emma Wilson',
          email: 'emma@ceramicstudio.com',
          phone: '+1-555-0125',
          businessName: 'Emma\'s Ceramic Studio',
          cubeNumber: 'C08',
          rentAmount: 520,
          rentDueDate: '2024-02-20',
          status: 'active',
          joinDate: '2023-09-10',
          productCategories: ['Ceramics', 'Pottery'],
          totalSales: 15200,
          commission: 18,
          notes: 'High-performing tenant',
        },
      ];
      setTenants(mockTenants);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCubes = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCubes: CubeAssignment[] = [
        { cubeId: '1', cubeNumber: 'A12', size: 'Large', location: 'Floor 1 - Section A', rentPrice: 450, status: 'occupied', tenantId: '1', tenantName: 'Sarah Johnson' },
        { cubeId: '2', cubeNumber: 'B05', size: 'Medium', location: 'Floor 1 - Section B', rentPrice: 380, status: 'occupied', tenantId: '2', tenantName: 'Mike Chen' },
        { cubeId: '3', cubeNumber: 'C08', size: 'Large', location: 'Floor 2 - Section C', rentPrice: 520, status: 'occupied', tenantId: '3', tenantName: 'Emma Wilson' },
        { cubeId: '4', cubeNumber: 'A15', size: 'Small', location: 'Floor 1 - Section A', rentPrice: 280, status: 'available' },
        { cubeId: '5', cubeNumber: 'B12', size: 'Medium', location: 'Floor 1 - Section B', rentPrice: 380, status: 'maintenance' },
      ];
      setCubes(mockCubes);
    } catch (error) {
      console.error('Error fetching cubes:', error);
    }
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.cubeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddTenant = async () => {
    try {
      const tenant: Tenant = {
        id: Date.now().toString(),
        name: newTenant.name,
        email: newTenant.email,
        phone: newTenant.phone,
        businessName: newTenant.businessName,
        cubeNumber: newTenant.cubeNumber,
        rentAmount: newTenant.rentAmount,
        rentDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        productCategories: newTenant.productCategories.split(',').map(cat => cat.trim()),
        totalSales: 0,
        commission: 15,
        notes: newTenant.notes,
      };

      setTenants([...tenants, tenant]);
      setNewTenant({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        cubeNumber: '',
        rentAmount: 0,
        productCategories: '',
        notes: '',
      });
      setIsAddTenantOpen(false);
    } catch (error) {
      console.error('Error adding tenant:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCubeStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tenant Management</h2>
        <Dialog open={isAddTenantOpen} onOpenChange={setIsAddTenantOpen}>
          <DialogTrigger asChild>
            <Button>
              <span className="mr-2">➕</span>
              Add New Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTenant.email}
                  onChange={(e) => setNewTenant({...newTenant, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newTenant.phone}
                  onChange={(e) => setNewTenant({...newTenant, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={newTenant.businessName}
                  onChange={(e) => setNewTenant({...newTenant, businessName: e.target.value})}
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <Label htmlFor="cubeNumber">Cube Number</Label>
                <Select onValueChange={(value) => setNewTenant({...newTenant, cubeNumber: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cube" />
                  </SelectTrigger>
                  <SelectContent>
                    {cubes.filter(cube => cube.status === 'available').map(cube => (
                      <SelectItem key={cube.cubeId} value={cube.cubeNumber}>
                        {cube.cubeNumber} - {cube.size} (${cube.rentPrice}/month)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rentAmount">Rent Amount</Label>
                <Input
                  id="rentAmount"
                  type="number"
                  value={newTenant.rentAmount}
                  onChange={(e) => setNewTenant({...newTenant, rentAmount: Number(e.target.value)})}
                  placeholder="Enter rent amount"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="productCategories">Product Categories</Label>
                <Input
                  id="productCategories"
                  value={newTenant.productCategories}
                  onChange={(e) => setNewTenant({...newTenant, productCategories: e.target.value})}
                  placeholder="Enter categories (comma separated)"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newTenant.notes}
                  onChange={(e) => setNewTenant({...newTenant, notes: e.target.value})}
                  placeholder="Enter any additional notes"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddTenantOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTenant}>
                Add Tenant
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="tenants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="cubes">Cube Management</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants">
          {/* Search and Filter */}
          <div className="flex space-x-4 mb-6">
            <Input
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tenants List */}
          <div className="space-y-4">
            {filteredTenants.map((tenant) => (
              <Card key={tenant.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold">{tenant.name}</h3>
                        <Badge className={getStatusColor(tenant.status)}>
                          {tenant.status}
                        </Badge>
                        <span className="text-sm text-gray-500">Cube {tenant.cubeNumber}</span>
                      </div>
                      <p className="text-gray-600 mb-1">{tenant.businessName}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Email:</span> {tenant.email}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {tenant.phone}
                        </div>
                        <div>
                          <span className="font-medium">Rent:</span> ${tenant.rentAmount}/month
                        </div>
                        <div>
                          <span className="font-medium">Due:</span> {tenant.rentDueDate}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium text-sm">Categories:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tenant.productCategories.map((category, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cubes">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cubes.map((cube) => (
              <Card key={cube.cubeId}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Cube {cube.cubeNumber}</CardTitle>
                    <Badge className={getCubeStatusColor(cube.status)}>
                      {cube.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Size:</span> {cube.size}</div>
                    <div><span className="font-medium">Location:</span> {cube.location}</div>
                    <div><span className="font-medium">Rent:</span> ${cube.rentPrice}/month</div>
                    {cube.tenantName && (
                      <div><span className="font-medium">Tenant:</span> {cube.tenantName}</div>
                    )}
                  </div>
                  <div className="mt-4">
                    {cube.status === 'available' ? (
                      <Button size="sm" className="w-full">
                        Assign Tenant
                      </Button>
                    ) : cube.status === 'occupied' ? (
                      <Button variant="outline" size="sm" className="w-full">
                        View Tenant
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" className="w-full">
                        Schedule Maintenance
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantManagement;