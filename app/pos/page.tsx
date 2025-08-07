'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types/product';
import { Sale, SaleItem } from '@/types/sales';
import { mockProducts, searchProducts } from '@/data/mockProducts';
import { getRoleDisplayName, getRolePermissions } from '@/data/mockAuth';
import { generateSaleNumber, calculateCommission } from '@/data/mockSales';

interface CartItem extends SaleItem {
  product: Product;
}

const POSPage = () => {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qr'>('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'cart'>('products');

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth');
        return;
      }

      const permissions = getRolePermissions(user.role);
      if (!permissions.includes('pos-sales')) {
        router.push('/');
        return;
      }

      // Load active products only
      const activeProducts = mockProducts.filter(p => p.status === 'active' && p.stock > 0);
      setProducts(activeProducts);
    }
  }, [user, isLoading, router]);

  const handleBarcodeSearch = () => {
    if (!barcodeInput.trim()) return;

    const product = products.find(p => p.barcode === barcodeInput.trim());
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      alert('Product not found with this barcode');
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
            : item
        ));
      } else {
        alert('Not enough stock available');
      }
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${product.id}`,
        productId: product.id,
        productName: product.name,
        barcode: product.barcode,
        quantity: 1,
        unitPrice: product.price,
        totalPrice: product.price,
        tenantId: product.tenantId,
        tenantName: product.tenantName,
        commissionRate: product.commissionRate,
        commissionAmount: calculateCommission(product.price, product.commissionRate),
        product: product
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(cart.map(item => {
      if (item.id === itemId) {
        const maxQuantity = item.product.stock;
        const quantity = Math.min(newQuantity, maxQuantity);
        return {
          ...item,
          quantity,
          totalPrice: quantity * item.unitPrice,
          commissionAmount: calculateCommission(quantity * item.unitPrice, item.commissionRate)
        };
      }
      return item;
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getTotalCommission = () => {
    return cart.reduce((total, item) => total + item.commissionAmount, 0);
  };

  const processSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const sale: Sale = {
        id: `sale-${Date.now()}`,
        saleNumber: generateSaleNumber(),
        items: cart.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          barcode: item.barcode,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          tenantId: item.tenantId,
          tenantName: item.tenantName,
          commissionRate: item.commissionRate,
          commissionAmount: item.commissionAmount
        })),
        subtotal: getTotalAmount(),
        tax: 0,
        total: getTotalAmount(),
        paymentMethod,
        paymentStatus: 'completed',
        timestamp: new Date().toISOString(),
        cashierId: user?.id || 'unknown',
        cashierName: user?.name || 'Unknown'
      };

      // Update product stock (in real app, this would be done on backend)
      const updatedProducts = products.map(product => {
        const cartItem = cart.find(item => item.productId === product.id);
        if (cartItem) {
          return { ...product, stock: product.stock - cartItem.quantity };
        }
        return product;
      });
      setProducts(updatedProducts);

      // Clear cart and close modal
      clearCart();
      setShowPaymentModal(false);
      setIsProcessing(false);

      // Show success message
      alert(`Sale completed successfully!\nSale Number: ${sale.saleNumber}\nTotal: $${sale.total.toFixed(2)}`);
    }, 2000);
  };

  const filteredProducts = searchTerm 
    ? searchProducts(searchTerm).filter(p => p.status === 'active' && p.stock > 0)
    : products.slice(0, 20); // Show first 20 products by default

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </button>
              <div className="h-4 sm:h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                <span className="hidden sm:inline">Point of Sale</span>
                <span className="sm:hidden">POS</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-xs sm:text-sm text-gray-600 hidden md:block">
                <span className="font-medium">{user.name}</span>
                <span className="ml-2 text-gray-400">({getRoleDisplayName(user.role)})</span>
              </div>
              <button
                 onClick={() => {
                   logout();
                   router.push('/auth');
                 }}
                 className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
               >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Tab Navigation */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Products
            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
              {filteredProducts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
              activeTab === 'cart'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cart
            {cart.length > 0 && (
              <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Left Panel - Products */}
        <div className={`flex-1 p-4 sm:p-6 overflow-y-auto ${
          activeTab === 'cart' ? 'hidden lg:block' : 'block'
        } ${cart.length > 0 ? 'pb-24 lg:pb-6' : ''}`}>
          <div className="mb-6">
            
            {/* Search and Barcode */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Barcode Scanner
                </label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Scan or enter barcode..."
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch()}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleBarcodeSearch}
                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow p-3 sm:p-4 cursor-pointer hover:shadow-md transition-shadow active:bg-gray-50"
                onClick={() => addToCart(product)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate pr-2">{product.name}</h3>
                  <span className="text-base sm:text-lg font-bold text-blue-600 flex-shrink-0">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1 truncate">Category: {product.category}</p>
                <p className="text-xs text-gray-500 mb-2 truncate">Tenant: {product.tenantName}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.stock > 5 
                      ? 'bg-green-100 text-green-800'
                      : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    Stock: {product.stock}
                  </span>
                  <span className="text-xs text-gray-500 truncate ml-2">{product.barcode}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
            </div>
          )}
        </div>

        {/* Right Panel - Cart */}
        <div className={`w-full lg:w-96 bg-white lg:border-l border-gray-200 p-4 sm:p-6 flex flex-col ${
          activeTab === 'products' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Cart</h2>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto mb-4 sm:mb-6">
            {cart.length > 0 ? (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm truncate pr-2">{item.productName}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 -m-1 flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 active:bg-gray-400"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 active:bg-gray-400"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-medium text-gray-900">${item.totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-1">
                      ${item.unitPrice.toFixed(2)} each • Commission: ${item.commissionAmount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Cart is empty</p>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>${getTotalAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Commission</span>
                  <span>${getTotalCommission().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>${getTotalAmount().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium text-base sm:text-lg"
              >
                Process Payment
              </button>
            </div>
          )}
          
          {/* Mobile Cart Actions */}
          {cart.length > 0 && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ${getTotalAmount().toFixed(2)}
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium text-lg"
              >
                Process Payment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Process Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 -m-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">${getTotalAmount().toFixed(2)}</div>
                <div className="text-sm text-gray-600">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['cash', 'card', 'qr'] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`px-3 py-3 text-sm font-medium rounded-md border transition-colors ${
                        paymentMethod === method
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 active:bg-gray-100'
                      }`}
                    >
                      {method.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 active:bg-gray-400"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={processSale}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Complete Sale'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSPage;