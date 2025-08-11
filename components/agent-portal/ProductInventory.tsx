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
import { AlertTriangle, Package, TrendingUp, TrendingDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  quantity: number;
  minStock: number;
  maxStock: number;
  tenantId: string;
  tenantName: string;
  cubeNumber: string;
  description: string;
  images: string[];
  status: 'active' | 'inactive' | 'discontinued';
  lastUpdated: string;
  totalSold: number;
  revenue: number;
}

interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  timestamp: string;
  performedBy: string;
}

interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'overstock';
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  severity: 'high' | 'medium' | 'low';
}

const ProductInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isStockAdjustmentOpen, setIsStockAdjustmentOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: '',
    price: 0,
    cost: 0,
    quantity: 0,
    minStock: 0,
    maxStock: 0,
    tenantId: '',
    description: '',
  });

  const [stockAdjustment, setStockAdjustment] = useState({
    productId: '',
    type: 'adjustment' as 'in' | 'out' | 'adjustment',
    quantity: 0,
    reason: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchStockMovements();
    generateAlerts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Abstract Canvas Painting',
          sku: 'ART-001',
          category: 'Paintings',
          price: 299.99,
          cost: 150.00,
          quantity: 5,
          minStock: 2,
          maxStock: 20,
          tenantId: '1',
          tenantName: 'Sarah Johnson',
          cubeNumber: 'A12',
          description: 'Beautiful abstract canvas painting with vibrant colors',
          images: [],
          status: 'active',
          lastUpdated: '2024-01-15',
          totalSold: 12,
          revenue: 3599.88,
        },
        {
          id: '2',
          name: 'Handmade Ceramic Vase',
          sku: 'CER-002',
          category: 'Ceramics',
          price: 89.99,
          cost: 35.00,
          quantity: 1,
          minStock: 3,
          maxStock: 15,
          tenantId: '3',
          tenantName: 'Emma Wilson',
          cubeNumber: 'C08',
          description: 'Elegant handmade ceramic vase with unique glaze',
          images: [],
          status: 'active',
          lastUpdated: '2024-01-14',
          totalSold: 8,
          revenue: 719.92,
        },
        {
          id: '3',
          name: 'Silver Jewelry Set',
          sku: 'JEW-003',
          category: 'Jewelry',
          price: 159.99,
          cost: 80.00,
          quantity: 0,
          minStock: 2,
          maxStock: 10,
          tenantId: '2',
          tenantName: 'Mike Chen',
          cubeNumber: 'B05',
          description: 'Elegant silver jewelry set with matching necklace and earrings',
          images: [],
          status: 'active',
          lastUpdated: '2024-01-13',
          totalSold: 15,
          revenue: 2399.85,
        },
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStockMovements = async () => {
    try {
      // Mock data - replace with actual API call
      const mockMovements: StockMovement[] = [
        {
          id: '1',
          productId: '1',
          productName: 'Abstract Canvas Painting',
          type: 'out',
          quantity: 2,
          reason: 'Sale',
          timestamp: '2024-01-15T10:30:00Z',
          performedBy: 'System',
        },
        {
          id: '2',
          productId: '2',
          productName: 'Handmade Ceramic Vase',
          type: 'in',
          quantity: 5,
          reason: 'New stock received',
          timestamp: '2024-01-14T14:20:00Z',
          performedBy: 'Agent',
        },
        {
          id: '3',
          productId: '3',
          productName: 'Silver Jewelry Set',
          type: 'out',
          quantity: 3,
          reason: 'Sale',
          timestamp: '2024-01-13T16:45:00Z',
          performedBy: 'System',
        },
      ];
      setStockMovements(mockMovements);
    } catch (error) {
      console.error('Error fetching stock movements:', error);
    }
  };

  const generateAlerts = () => {
    // This would typically be done on the backend
    const mockAlerts: InventoryAlert[] = [
      {
        id: '1',
        type: 'low_stock',
        productId: '2',
        productName: 'Handmade Ceramic Vase',
        currentStock: 1,
        threshold: 3,
        severity: 'high',
      },
      {
        id: '2',
        type: 'out_of_stock',
        productId: '3',
        productName: 'Silver Jewelry Set',
        currentStock: 0,
        threshold: 2,
        severity: 'high',
      },
    ];
    setAlerts(mockAlerts);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddProduct = async () => {
    try {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        sku: newProduct.sku,
        category: newProduct.category,
        price: newProduct.price,
        cost: newProduct.cost,
        quantity: newProduct.quantity,
        minStock: newProduct.minStock,
        maxStock: newProduct.maxStock,
        tenantId: newProduct.tenantId,
        tenantName: 'Selected Tenant', // This would come from tenant lookup
        cubeNumber: 'A12', // This would come from tenant data
        description: newProduct.description,
        images: [],
        status: 'active',
        lastUpdated: new Date().toISOString().split('T')[0],
        totalSold: 0,
        revenue: 0,
      };

      setProducts([...products, product]);
      setNewProduct({
        name: '',
        sku: '',
        category: '',
        price: 0,
        cost: 0,
        quantity: 0,
        minStock: 0,
        maxStock: 0,
        tenantId: '',
        description: '',
      });
      setIsAddProductOpen(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleStockAdjustment = async () => {
    try {
      const movement: StockMovement = {
        id: Date.now().toString(),
        productId: stockAdjustment.productId,
        productName: products.find(p => p.id === stockAdjustment.productId)?.name || '',
        type: stockAdjustment.type,
        quantity: stockAdjustment.quantity,
        reason: stockAdjustment.reason,
        timestamp: new Date().toISOString(),
        performedBy: 'Agent',
      };

      setStockMovements([movement, ...stockMovements]);
      
      // Update product quantity
      setProducts(products.map(product => {
        if (product.id === stockAdjustment.productId) {
          let newQuantity = product.quantity;
          if (stockAdjustment.type === 'in') {
            newQuantity += stockAdjustment.quantity;
          } else if (stockAdjustment.type === 'out') {
            newQuantity -= stockAdjustment.quantity;
          } else {
            newQuantity = stockAdjustment.quantity;
          }
          return { ...product, quantity: Math.max(0, newQuantity) };
        }
        return product;
      }));

      setStockAdjustment({
        productId: '',
        type: 'adjustment',
        quantity: 0,
        reason: '',
      });
      setIsStockAdjustmentOpen(false);
    } catch (error) {
      console.error('Error adjusting stock:', error);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (product.quantity <= product.minStock) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    if (product.quantity >= product.maxStock) return { status: 'Overstock', color: 'bg-orange-100 text-orange-800' };
    return { status: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Inventory</h2>
        <div className="flex space-x-2">
          <Dialog open={isStockAdjustmentOpen} onOpenChange={setIsStockAdjustmentOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Stock Adjustment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Stock Adjustment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product">Product</Label>
                  <Select onValueChange={(value) => setStockAdjustment({...stockAdjustment, productId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} (Current: {product.quantity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Adjustment Type</Label>
                  <Select onValueChange={(value: 'in' | 'out' | 'adjustment') => setStockAdjustment({...stockAdjustment, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">Stock In</SelectItem>
                      <SelectItem value="out">Stock Out</SelectItem>
                      <SelectItem value="adjustment">Set Quantity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={stockAdjustment.quantity}
                    onChange={(e) => setStockAdjustment({...stockAdjustment, quantity: Number(e.target.value)})}
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={stockAdjustment.reason}
                    onChange={(e) => setStockAdjustment({...stockAdjustment, reason: e.target.value})}
                    placeholder="Enter reason for adjustment"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsStockAdjustmentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStockAdjustment}>
                  Apply Adjustment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button>
                <span className="mr-2">➕</span>
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    placeholder="Enter SKU"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paintings">Paintings</SelectItem>
                      <SelectItem value="Sculptures">Sculptures</SelectItem>
                      <SelectItem value="Ceramics">Ceramics</SelectItem>
                      <SelectItem value="Jewelry">Jewelry</SelectItem>
                      <SelectItem value="Crafts">Crafts</SelectItem>
                      <SelectItem value="Photography">Photography</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tenantId">Tenant</Label>
                  <Select onValueChange={(value) => setNewProduct({...newProduct, tenantId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Sarah Johnson (A12)</SelectItem>
                      <SelectItem value="2">Mike Chen (B05)</SelectItem>
                      <SelectItem value="3">Emma Wilson (C08)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={newProduct.cost}
                    onChange={(e) => setNewProduct({...newProduct, cost: Number(e.target.value)})}
                    placeholder="Enter cost"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Initial Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: Number(e.target.value)})}
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <Label htmlFor="minStock">Min Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={newProduct.minStock}
                    onChange={(e) => setNewProduct({...newProduct, minStock: Number(e.target.value)})}
                    placeholder="Enter min stock"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Enter product description"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="alerts">Alerts ({alerts.length})</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          {/* Search and Filter */}
          <div className="flex space-x-4 mb-6">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Paintings">Paintings</SelectItem>
                <SelectItem value="Sculptures">Sculptures</SelectItem>
                <SelectItem value="Ceramics">Ceramics</SelectItem>
                <SelectItem value="Jewelry">Jewelry</SelectItem>
                <SelectItem value="Crafts">Crafts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product);
              return (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-gray-500">{product.sku}</p>
                      </div>
                      <Badge className={stockStatus.color}>
                        {stockStatus.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-medium">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-medium">${product.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stock:</span>
                        <span className="font-medium">{product.quantity} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tenant:</span>
                        <span className="font-medium">{product.tenantName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cube:</span>
                        <span className="font-medium">{product.cubeNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Sold:</span>
                        <span className="font-medium">{product.totalSold}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="font-medium">${product.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <div>
                        <h3 className="font-medium">{alert.productName}</h3>
                        <p className="text-sm text-gray-600">
                          {alert.type === 'low_stock' && `Low stock: ${alert.currentStock} units (threshold: ${alert.threshold})`}
                          {alert.type === 'out_of_stock' && 'Out of stock'}
                          {alert.type === 'overstock' && `Overstock: ${alert.currentStock} units (max: ${alert.threshold})`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getAlertSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Button size="sm">
                        Resolve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="movements">
          <div className="space-y-4">
            {stockMovements.map((movement) => (
              <Card key={movement.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {movement.type === 'in' ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <h3 className="font-medium">{movement.productName}</h3>
                        <p className="text-sm text-gray-600">
                          {movement.type === 'in' ? '+' : '-'}{movement.quantity} units - {movement.reason}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{new Date(movement.timestamp).toLocaleDateString()}</p>
                      <p>by {movement.performedBy}</p>
                    </div>
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

export default ProductInventory;