'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, CreditCard, Receipt, Trash2, Plus, Minus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  category: string;
  tenantId: string;
  tenantName: string;
  cubeNumber: string;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  tenantId: string;
  tenantName: string;
  cubeNumber: string;
}

interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'digital';
  status: 'completed' | 'pending' | 'refunded';
  timestamp: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  notes: string;
}

interface DailySummary {
  totalSales: number;
  totalTransactions: number;
  averageTransaction: number;
  cashSales: number;
  cardSales: number;
  digitalSales: number;
  topSellingProduct: string;
  topPerformingTenant: string;
}

const POSSystem = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const TAX_RATE = 0.08; // 8% tax rate

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
    fetchDailySummary();
  }, []);

  const fetchProducts = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Abstract Canvas Painting',
          sku: 'ART-001',
          price: 299.99,
          quantity: 5,
          category: 'Paintings',
          tenantId: '1',
          tenantName: 'Sarah Johnson',
          cubeNumber: 'A12',
        },
        {
          id: '2',
          name: 'Handmade Ceramic Vase',
          sku: 'CER-002',
          price: 89.99,
          quantity: 3,
          category: 'Ceramics',
          tenantId: '3',
          tenantName: 'Emma Wilson',
          cubeNumber: 'C08',
        },
        {
          id: '3',
          name: 'Silver Jewelry Set',
          sku: 'JEW-003',
          price: 159.99,
          quantity: 2,
          category: 'Jewelry',
          tenantId: '2',
          tenantName: 'Mike Chen',
          cubeNumber: 'B05',
        },
        {
          id: '4',
          name: 'Wooden Sculpture',
          sku: 'SCU-004',
          price: 450.00,
          quantity: 1,
          category: 'Sculptures',
          tenantId: '1',
          tenantName: 'Sarah Johnson',
          cubeNumber: 'A12',
        },
        {
          id: '5',
          name: 'Handwoven Scarf',
          sku: 'TEX-005',
          price: 65.00,
          quantity: 8,
          category: 'Textiles',
          tenantId: '2',
          tenantName: 'Mike Chen',
          cubeNumber: 'B05',
        },
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          items: [
            {
              productId: '1',
              name: 'Abstract Canvas Painting',
              price: 299.99,
              quantity: 1,
              tenantId: '1',
              tenantName: 'Sarah Johnson',
              cubeNumber: 'A12',
            },
          ],
          subtotal: 299.99,
          tax: 24.00,
          total: 323.99,
          paymentMethod: 'card',
          status: 'completed',
          timestamp: '2024-01-15T14:30:00Z',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          notes: '',
        },
        {
          id: '2',
          items: [
            {
              productId: '2',
              name: 'Handmade Ceramic Vase',
              price: 89.99,
              quantity: 2,
              tenantId: '3',
              tenantName: 'Emma Wilson',
              cubeNumber: 'C08',
            },
          ],
          subtotal: 179.98,
          tax: 14.40,
          total: 194.38,
          paymentMethod: 'cash',
          status: 'completed',
          timestamp: '2024-01-15T12:15:00Z',
          notes: 'Customer requested gift wrapping',
        },
      ];
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchDailySummary = async () => {
    try {
      // Mock data - replace with actual API call
      const mockSummary: DailySummary = {
        totalSales: 1250.75,
        totalTransactions: 15,
        averageTransaction: 83.38,
        cashSales: 450.25,
        cardSales: 650.50,
        digitalSales: 150.00,
        topSellingProduct: 'Abstract Canvas Painting',
        topPerformingTenant: 'Sarah Johnson',
      };
      setDailySummary(mockSummary);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.quantity > 0;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.quantity) {
        setCart(cart.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      const cartItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        tenantId: product.tenantId,
        tenantName: product.tenantName,
        cubeNumber: product.cubeNumber,
      };
      setCart([...cart, cartItem]);
    }
  };

  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product && newQuantity <= product.quantity) {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * TAX_RATE;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const processTransaction = async () => {
    try {
      const subtotal = calculateSubtotal();
      const tax = calculateTax(subtotal);
      const total = subtotal + tax;

      const transaction: Transaction = {
        id: Date.now().toString(),
        items: [...cart],
        subtotal,
        tax,
        total,
        paymentMethod,
        status: 'completed',
        timestamp: new Date().toISOString(),
        customerName: customerInfo.name || undefined,
        customerEmail: customerInfo.email || undefined,
        notes: '',
      };

      // Update product quantities
      setProducts(products.map(product => {
        const cartItem = cart.find(item => item.productId === product.id);
        if (cartItem) {
          return { ...product, quantity: product.quantity - cartItem.quantity };
        }
        return product;
      }));

      setTransactions([transaction, ...transactions]);
      clearCart();
      setCustomerInfo({ name: '', email: '' });
      setIsCheckoutOpen(false);

      // Show success message or receipt
      alert(`Transaction completed successfully! Total: $${total.toFixed(2)}`);
    } catch (error) {
      console.error('Error processing transaction:', error);
      alert('Error processing transaction. Please try again.');
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return '💵';
      case 'card':
        return '💳';
      case 'digital':
        return '📱';
      default:
        return '💰';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">POS System</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Today's Sales: ${dailySummary?.totalSales.toFixed(2) || '0.00'}
          </span>
        </div>
      </div>

      <Tabs defaultValue="pos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pos">Point of Sale</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="summary">Daily Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="pos">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products Section */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <div className="flex space-x-4">
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Paintings">Paintings</SelectItem>
                      <SelectItem value="Sculptures">Sculptures</SelectItem>
                      <SelectItem value="Ceramics">Ceramics</SelectItem>
                      <SelectItem value="Jewelry">Jewelry</SelectItem>
                      <SelectItem value="Textiles">Textiles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => addToCart(product)}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm">{product.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {product.quantity} left
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold">${product.price}</p>
                          <p className="text-xs text-gray-500">{product.tenantName}</p>
                        </div>
                        <Button size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cart Section */}
            <div>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Cart ({cart.length})
                    </CardTitle>
                    {cart.length > 0 && (
                      <Button variant="outline" size="sm" onClick={clearCart}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Cart is empty</p>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex justify-between items-center p-2 border rounded">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.tenantName}</p>
                            <p className="text-sm font-bold">${item.price}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax ({(TAX_RATE * 100).toFixed(0)}%):</span>
                          <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>

                      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full mt-4">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Checkout
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Complete Transaction</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="paymentMethod">Payment Method</Label>
                              <Select value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'digital') => setPaymentMethod(value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cash">💵 Cash</SelectItem>
                                  <SelectItem value="card">💳 Card</SelectItem>
                                  <SelectItem value="digital">📱 Digital Payment</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="customerName">Customer Name (Optional)</Label>
                              <Input
                                id="customerName"
                                value={customerInfo.name}
                                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                                placeholder="Enter customer name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="customerEmail">Customer Email (Optional)</Label>
                              <Input
                                id="customerEmail"
                                type="email"
                                value={customerInfo.email}
                                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                                placeholder="Enter customer email"
                              />
                            </div>
                            <div className="bg-gray-50 p-4 rounded">
                              <div className="flex justify-between mb-2">
                                <span>Subtotal:</span>
                                <span>${calculateSubtotal().toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between mb-2">
                                <span>Tax:</span>
                                <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={processTransaction}>
                              Complete Transaction
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">Transaction #{transaction.id}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${transaction.total.toFixed(2)}</p>
                      <div className="flex items-center space-x-2">
                        <span>{getPaymentMethodIcon(transaction.paymentMethod)}</span>
                        <Badge className="capitalize">{transaction.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {transaction.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  {transaction.customerName && (
                    <p className="text-sm text-gray-600 mt-2">
                      Customer: {transaction.customerName}
                    </p>
                  )}
                  <div className="flex justify-end mt-3">
                    <Button variant="outline" size="sm">
                      <Receipt className="w-4 h-4 mr-2" />
                      Print Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="summary">
          {dailySummary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dailySummary.totalSales.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    {dailySummary.totalTransactions} transactions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dailySummary.averageTransaction.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Per transaction
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>💵 Cash:</span>
                      <span>${dailySummary.cashSales.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>💳 Card:</span>
                      <span>${dailySummary.cardSales.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>📱 Digital:</span>
                      <span>${dailySummary.digitalSales.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Product:</span>
                      <p className="text-xs text-gray-600">{dailySummary.topSellingProduct}</p>
                    </div>
                    <div>
                      <span className="font-medium">Tenant:</span>
                      <p className="text-xs text-gray-600">{dailySummary.topPerformingTenant}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default POSSystem;