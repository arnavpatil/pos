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
import { Switch } from '@/components/ui/switch';
import { 
  Grid3X3, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  User, 
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Cube {
  id: string;
  number: string;
  section: string;
  size: 'small' | 'medium' | 'large';
  dimensions: string;
  monthlyRent: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  tenant?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    leaseStart: string;
    leaseEnd: string;
  };
  features: string[];
  location: {
    floor: number;
    zone: string;
    coordinates: { x: number; y: number };
  };
  maintenanceHistory: Array<{
    date: string;
    type: string;
    description: string;
    cost: number;
    status: 'completed' | 'pending';
  }>;
  utilities: {
    electricity: boolean;
    lighting: boolean;
    security: boolean;
    climate: boolean;
  };
}

interface CubeFormData {
  number: string;
  section: string;
  size: 'small' | 'medium' | 'large';
  dimensions: string;
  monthlyRent: number;
  features: string[];
  floor: number;
  zone: string;
  utilities: {
    electricity: boolean;
    lighting: boolean;
    security: boolean;
    climate: boolean;
  };
}

const CubeManagement = () => {
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [filteredCubes, setFilteredCubes] = useState<Cube[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCube, setEditingCube] = useState<Cube | null>(null);
  const [formData, setFormData] = useState<CubeFormData>({
    number: '',
    section: '',
    size: 'medium',
    dimensions: '',
    monthlyRent: 0,
    features: [],
    floor: 1,
    zone: '',
    utilities: {
      electricity: true,
      lighting: true,
      security: true,
      climate: false,
    },
  });

  useEffect(() => {
    fetchCubes();
  }, []);

  useEffect(() => {
    filterCubes();
  }, [cubes, searchTerm, statusFilter, sizeFilter]);

  const fetchCubes = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockCubes: Cube[] = [
        {
          id: '1',
          number: 'A12',
          section: 'A',
          size: 'medium',
          dimensions: '8x8x8 ft',
          monthlyRent: 425.50,
          status: 'occupied',
          tenant: {
            id: 'tenant_001',
            name: 'Sarah Johnson',
            email: 'sarah@email.com',
            phone: '(555) 123-4567',
            leaseStart: '2023-08-15',
            leaseEnd: '2024-08-14',
          },
          features: ['Corner Location', 'High Traffic', 'Natural Light'],
          location: {
            floor: 1,
            zone: 'Main Gallery',
            coordinates: { x: 2, y: 3 },
          },
          maintenanceHistory: [
            {
              date: '2024-01-15',
              type: 'Cleaning',
              description: 'Deep cleaning and sanitization',
              cost: 75.00,
              status: 'completed',
            },
          ],
          utilities: {
            electricity: true,
            lighting: true,
            security: true,
            climate: true,
          },
        },
        {
          id: '2',
          number: 'B05',
          section: 'B',
          size: 'large',
          dimensions: '10x10x10 ft',
          monthlyRent: 650.00,
          status: 'occupied',
          tenant: {
            id: 'tenant_003',
            name: 'Mike Chen',
            email: 'mike@email.com',
            phone: '(555) 987-6543',
            leaseStart: '2023-06-20',
            leaseEnd: '2024-06-19',
          },
          features: ['Large Space', 'Storage Area', 'Display Window'],
          location: {
            floor: 1,
            zone: 'Artist Quarter',
            coordinates: { x: 1, y: 5 },
          },
          maintenanceHistory: [],
          utilities: {
            electricity: true,
            lighting: true,
            security: true,
            climate: false,
          },
        },
        {
          id: '3',
          number: 'C08',
          section: 'C',
          size: 'small',
          dimensions: '6x6x8 ft',
          monthlyRent: 325.00,
          status: 'available',
          features: ['Affordable', 'Good Lighting'],
          location: {
            floor: 2,
            zone: 'Upper Level',
            coordinates: { x: 3, y: 8 },
          },
          maintenanceHistory: [
            {
              date: '2024-02-01',
              type: 'Repair',
              description: 'Fixed lighting fixture',
              cost: 125.00,
              status: 'completed',
            },
          ],
          utilities: {
            electricity: true,
            lighting: true,
            security: true,
            climate: false,
          },
        },
        {
          id: '4',
          number: 'A15',
          section: 'A',
          size: 'medium',
          dimensions: '8x8x8 ft',
          monthlyRent: 425.50,
          status: 'maintenance',
          features: ['Corner Location', 'High Traffic'],
          location: {
            floor: 1,
            zone: 'Main Gallery',
            coordinates: { x: 2, y: 5 },
          },
          maintenanceHistory: [
            {
              date: '2024-03-10',
              type: 'Renovation',
              description: 'Updating electrical and lighting systems',
              cost: 850.00,
              status: 'pending',
            },
          ],
          utilities: {
            electricity: true,
            lighting: true,
            security: true,
            climate: true,
          },
        },
        {
          id: '5',
          number: 'B15',
          section: 'B',
          size: 'medium',
          dimensions: '8x8x8 ft',
          monthlyRent: 425.50,
          status: 'reserved',
          features: ['Good Location', 'Natural Light'],
          location: {
            floor: 1,
            zone: 'Artist Quarter',
            coordinates: { x: 1, y: 15 },
          },
          maintenanceHistory: [],
          utilities: {
            electricity: true,
            lighting: true,
            security: true,
            climate: false,
          },
        },
      ];

      setCubes(mockCubes);
    } catch (error) {
      console.error('Error fetching cubes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCubes = () => {
    let filtered = cubes;

    if (searchTerm) {
      filtered = filtered.filter(
        (cube) =>
          cube.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cube.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cube.tenant?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((cube) => cube.status === statusFilter);
    }

    if (sizeFilter !== 'all') {
      filtered = filtered.filter((cube) => cube.size === sizeFilter);
    }

    setFilteredCubes(filtered);
  };

  const handleAddCube = async () => {
    try {
      const newCube: Cube = {
        id: Date.now().toString(),
        ...formData,
        status: 'available',
        location: {
          floor: formData.floor,
          zone: formData.zone,
          coordinates: { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 20) },
        },
        maintenanceHistory: [],
      };

      setCubes((prev) => [...prev, newCube]);
      setShowAddForm(false);
      resetForm();
      alert('Cube added successfully!');
    } catch (error) {
      console.error('Error adding cube:', error);
      alert('Failed to add cube');
    }
  };

  const handleEditCube = async () => {
    if (!editingCube) return;

    try {
      const updatedCube: Cube = {
        ...editingCube,
        ...formData,
        location: {
          ...editingCube.location,
          floor: formData.floor,
          zone: formData.zone,
        },
      };

      setCubes((prev) =>
        prev.map((cube) => (cube.id === editingCube.id ? updatedCube : cube))
      );
      setEditingCube(null);
      resetForm();
      alert('Cube updated successfully!');
    } catch (error) {
      console.error('Error updating cube:', error);
      alert('Failed to update cube');
    }
  };

  const handleDeleteCube = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cube?')) return;

    try {
      setCubes((prev) => prev.filter((cube) => cube.id !== id));
      alert('Cube deleted successfully!');
    } catch (error) {
      console.error('Error deleting cube:', error);
      alert('Failed to delete cube');
    }
  };

  const resetForm = () => {
    setFormData({
      number: '',
      section: '',
      size: 'medium',
      dimensions: '',
      monthlyRent: 0,
      features: [],
      floor: 1,
      zone: '',
      utilities: {
        electricity: true,
        lighting: true,
        security: true,
        climate: false,
      },
    });
  };

  const startEdit = (cube: Cube) => {
    setEditingCube(cube);
    setFormData({
      number: cube.number,
      section: cube.section,
      size: cube.size,
      dimensions: cube.dimensions,
      monthlyRent: cube.monthlyRent,
      features: cube.features,
      floor: cube.location.floor,
      zone: cube.location.zone,
      utilities: cube.utilities,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      occupied: { color: 'bg-blue-100 text-blue-800', icon: User },
      maintenance: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      reserved: { color: 'bg-purple-100 text-purple-800', icon: Clock },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || CheckCircle;
    
    return (
      <Badge className={config?.color || 'bg-gray-100 text-gray-800'}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getSizeBadge = (size: string) => {
    const colors = {
      small: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      large: 'bg-orange-100 text-orange-800',
    };
    return (
      <Badge className={colors[size as keyof typeof colors]}>
        {size.charAt(0).toUpperCase() + size.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cube Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Cube
        </Button>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">
            <Grid3X3 className="w-4 h-4 mr-2" />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search cubes..."
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
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sizeFilter} onValueChange={setSizeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cubes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCubes.map((cube) => (
              <Card key={cube.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Cube {cube.number}</CardTitle>
                      <p className="text-sm text-gray-500">
                        Section {cube.section} • Floor {cube.location.floor}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => startEdit(cube)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCube(cube.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    {getStatusBadge(cube.status)}
                    {getSizeBadge(cube.size)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Package className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{cube.dimensions}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{formatCurrency(cube.monthlyRent)}/month</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{cube.location.zone}</span>
                    </div>
                  </div>

                  {cube.tenant && (
                    <div className="border-t pt-3">
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">{cube.tenant.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {new Date(cube.tenant.leaseStart).toLocaleDateString()} - 
                          {new Date(cube.tenant.leaseEnd).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {cube.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {cube.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {cube.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{cube.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Cube</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Size</th>
                      <th className="text-left p-2">Rent</th>
                      <th className="text-left p-2">Tenant</th>
                      <th className="text-left p-2">Location</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCubes.map((cube) => (
                      <tr key={cube.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{cube.number}</td>
                        <td className="p-2">{getStatusBadge(cube.status)}</td>
                        <td className="p-2">{getSizeBadge(cube.size)}</td>
                        <td className="p-2">{formatCurrency(cube.monthlyRent)}</td>
                        <td className="p-2">
                          {cube.tenant ? cube.tenant.name : '-'}
                        </td>
                        <td className="p-2">
                          Floor {cube.location.floor}, {cube.location.zone}
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => startEdit(cube)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteCube(cube.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Cubes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cubes.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Occupied</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {cubes.filter(c => c.status === 'occupied').length}
                </div>
                <p className="text-xs text-gray-500">
                  {((cubes.filter(c => c.status === 'occupied').length / cubes.length) * 100).toFixed(1)}% occupancy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {cubes.filter(c => c.status === 'available').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    cubes
                      .filter(c => c.status === 'occupied')
                      .reduce((sum, c) => sum + c.monthlyRent, 0)
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cube Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['available', 'occupied', 'maintenance', 'reserved'].map((status) => {
                    const count = cubes.filter(c => c.status === status).length;
                    const percentage = (count / cubes.length) * 100;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(status)}
                          <span className="text-sm">{count} cubes</span>
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
                <CardTitle>Size Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['small', 'medium', 'large'].map((size) => {
                    const count = cubes.filter(c => c.size === size).length;
                    const avgRent = cubes
                      .filter(c => c.size === size)
                      .reduce((sum, c) => sum + c.monthlyRent, 0) / count || 0;
                    return (
                      <div key={size} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getSizeBadge(size)}
                          <span className="text-sm">{count} cubes</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Avg: {formatCurrency(avgRent)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingCube) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingCube ? 'Edit Cube' : 'Add New Cube'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="number">Cube Number</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                    placeholder="e.g., A12"
                  />
                </div>
                <div>
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    value={formData.section}
                    onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                    placeholder="e.g., A"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Select value={formData.size} onValueChange={(value: 'small' | 'medium' | 'large') => 
                    setFormData(prev => ({ ...prev, size: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                    placeholder="e.g., 8x8x8 ft"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rent">Monthly Rent ($)</Label>
                  <Input
                    id="rent"
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyRent: parseFloat(e.target.value) || 0 }))}
                    placeholder="425.50"
                  />
                </div>
                <div>
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    type="number"
                    value={formData.floor}
                    onChange={(e) => setFormData(prev => ({ ...prev, floor: parseInt(e.target.value) || 1 }))}
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="zone">Zone</Label>
                <Input
                  id="zone"
                  value={formData.zone}
                  onChange={(e) => setFormData(prev => ({ ...prev, zone: e.target.value }))}
                  placeholder="e.g., Main Gallery"
                />
              </div>

              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Textarea
                  id="features"
                  value={formData.features.join(', ')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    features: e.target.value.split(',').map(f => f.trim()).filter(f => f) 
                  }))}
                  placeholder="Corner Location, High Traffic, Natural Light"
                  rows={3}
                />
              </div>

              <div>
                <Label>Utilities</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="electricity"
                      checked={formData.utilities.electricity}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ 
                          ...prev, 
                          utilities: { ...prev.utilities, electricity: checked } 
                        }))
                      }
                    />
                    <Label htmlFor="electricity">Electricity</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="lighting"
                      checked={formData.utilities.lighting}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ 
                          ...prev, 
                          utilities: { ...prev.utilities, lighting: checked } 
                        }))
                      }
                    />
                    <Label htmlFor="lighting">Lighting</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="security"
                      checked={formData.utilities.security}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ 
                          ...prev, 
                          utilities: { ...prev.utilities, security: checked } 
                        }))
                      }
                    />
                    <Label htmlFor="security">Security</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="climate"
                      checked={formData.utilities.climate}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ 
                          ...prev, 
                          utilities: { ...prev.utilities, climate: checked } 
                        }))
                      }
                    />
                    <Label htmlFor="climate">Climate Control</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCube(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={editingCube ? handleEditCube : handleAddCube}>
                  {editingCube ? 'Update' : 'Add'} Cube
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CubeManagement;