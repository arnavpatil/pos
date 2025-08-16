'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { tenantPortalService, TenantDetails, TenantProduct } from '@/services/tenantPortalService';
import { authService } from '@/services/authService';
import Snackbar from '@/components/Snackbar';

const TenantDashboard = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [tenantDetails, setTenantDetails] = useState<TenantDetails | null>(null);
  const [tenantProducts, setTenantProducts] = useState<TenantProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'logs' | 'profile'>('dashboard');


  const [showUpdateStock, setShowUpdateStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TenantProduct | null>(null);
  const [updateStockForm, setUpdateStockForm] = useState({ price: 0, stock: 0 });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({ isVisible: false, message: '', type: 'success' });


  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth');
        return;
      }

      // Check if user has tenant role
      if (user.role !== 'tenant') {
        router.push('/');
        return;
      }

      loadTenantData();
    }
  }, [user, isLoading, router]);

  const loadTenantData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load tenant details and products
      const [details, products] = await Promise.all([
        tenantPortalService.getTenantDetails(),
        tenantPortalService.getTenantProducts()
      ]);

      setTenantDetails(details);
      setTenantProducts(products);
    } catch (err) {
      console.error('Error loading tenant data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tenant data');
    } finally {
      setLoading(false);
    }
  };



  const openUpdateStockModal = (product: TenantProduct) => {
    setSelectedProduct(product);
    setUpdateStockForm({ price: product.price, stock: product.stock });
    setShowUpdateStock(true);
  };

  const handleProductClick = (product: TenantProduct) => {
    router.push(`/tenant/products/${product.id}`);
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsUpdatingStock(true);
    try {
      const updatedProduct = await tenantPortalService.updateProductStock(
        selectedProduct.id, 
        updateStockForm.stock, 
        updateStockForm.price
      );
      
      // Update the product in the local state
      setTenantProducts(prev => 
        prev.map(product => 
          product.id === selectedProduct.id 
            ? { ...product, stock: updatedProduct.stock, price: updatedProduct.price }
            : product
        )
      );
      
      setShowUpdateStock(false);
      setSelectedProduct(null);
      
      // Show success snackbar
      setSnackbar({
        isVisible: true,
        message: 'Product updated successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating product:', error);
      
      // Show error snackbar
      setSnackbar({
        isVisible: true,
        message: 'Failed to update product. Please try again.',
        type: 'error'
      });
    } finally {
      setIsUpdatingStock(false);
    }
  };



  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isVisible: false }));
  };

  const handleLogout = () => {
    // Use AuthContext logout method for proper state management
    if (user) {
      authService.removeAuthToken();
      // Force page reload to clear all state and redirect to auth
      window.location.href = '/auth';
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading tenant data</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button 
            onClick={loadTenantData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const lowStockProducts = tenantProducts.filter(p => p.stock <= 5);
  const pendingProducts = tenantProducts.filter(p => p.status === 'PENDING');
  const approvedProducts = tenantProducts.filter(p => p.status === 'APPROVED');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {tenantDetails?.user.name || user.name}
            </h1>
            <p className="text-gray-600 mt-2">
              {tenantDetails?.businessName} | Artist Portal
            </p>
          </div>
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 bg-white rounded-lg shadow px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {(tenantDetails?.user.name || user.name)?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{tenantDetails?.user.name || user.name}</p>
                <p className="text-xs text-gray-500">{tenantDetails?.user.email || user.email}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-200 sm:hidden">
                    <p className="text-sm font-medium text-gray-900">{tenantDetails?.user.name || user.name}</p>
                    <p className="text-xs text-gray-500">{tenantDetails?.user.email || user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Logs
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Alerts */}
            {(lowStockProducts.length > 0 || pendingProducts.length > 0) && (
              <div className="mb-6 space-y-4">
                {lowStockProducts.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Low Stock Alert</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>{lowStockProducts.length} product(s) are running low on stock</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {pendingProducts.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Pending Approval</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>{pendingProducts.length} product(s) are pending admin approval</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div 
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setActiveTab('products')}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-semibold text-gray-900">{tenantProducts.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved Products</p>
                    <p className="text-2xl font-semibold text-gray-900">{approvedProducts.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                    <p className="text-2xl font-semibold text-gray-900">{pendingProducts.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Cube Rentals</p>
                    <p className="text-2xl font-semibold text-gray-900">{tenantDetails?.rentals.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Information */}
            {tenantDetails?.rentals && tenantDetails.rentals.length > 0 && (
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Your Cube Rentals</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {tenantDetails.rentals.map((rental) => (
                      <div key={rental.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">Cube {rental.cube.code}</h4>
                            <p className="text-sm text-gray-600">{rental.cube.size} - ${rental.cube.pricePerMonth}/month</p>
                            <p className="text-sm text-gray-600">
                              {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              rental.status === 'ACTIVE' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {rental.status}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">Monthly: ${rental.monthlyRent}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
              <button
                onClick={() => router.push('/tenant/products/add')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </button>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                {tenantProducts.length > 0 ? (
                  <div className="space-y-4">
                    {tenantProducts.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleProductClick(product)}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            {/* Product Image - Placeholder */}
                            <div className="mb-3">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400 text-xs">IMG</span>
                              </div>
                            </div>
                            
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                            
                            {/* Basic Product Info */}
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm text-gray-600">Base Price: ${product.price}</span>
                              <span className="text-sm text-gray-600">Total Stock: {product.stock}</span>
                              <span className="text-sm text-gray-600">Category: {product.category}</span>
                              <span className="text-sm text-gray-600">SKU: {product.sku}</span>
                            </div>
                            
                            {/* Variants Display */}
                            {product.variants && product.variants.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-2">Variants ({product.variants.length}):</p>
                                <div className="flex flex-wrap gap-2">
                                  {product.variants.slice(0, 3).map((variant, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                      {variant.color} {variant.size} - ${variant.price} ({variant.stock} in stock)
                                    </span>
                                  ))}
                                  {product.variants.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                      +{product.variants.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-800'
                                : product.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.status}
                            </span>
                            {/* <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openUpdateStockModal(product);
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              Update
                            </button> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-gray-500">No products yet. Add your first product to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && tenantDetails && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
            
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Name</label>
                        <p className="text-gray-900">{tenantDetails.user.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900">{tenantDetails.user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gray-900">{tenantDetails.user.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Business Name</label>
                        <p className="text-gray-900">{tenantDetails.businessName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Address</label>
                        <p className="text-gray-900">{tenantDetails.address}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Notes</label>
                        <p className="text-gray-900">{tenantDetails.notes || 'No notes'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Member Since</label>
                        <p className="text-gray-900">{new Date(tenantDetails.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Change Logs</h2>
            
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                {tenantProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">No product logs available</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {tenantProducts.map(product => {
                      const logs = (product as any).logs || [];
                      if (logs.length === 0) return null;
                      
                      return (
                        <div key={product.id} className="border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                          </div>
                          
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Change Type
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Previous Value
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    New Value
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date & Time
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {logs.map((log: any) => {
                                  const getChangeTypeDisplay = (changeType: string) => {
                                    switch (changeType) {
                                      case 'SUBMISSION':
                                        return { text: 'Initial Submission', color: 'bg-blue-100 text-blue-800' };
                                      case 'PRICE_UPDATE':
                                        return { text: 'Price Update', color: 'bg-green-100 text-green-800' };
                                      case 'STOCK_UPDATE':
                                        return { text: 'Stock Update', color: 'bg-yellow-100 text-yellow-800' };
                                      case 'STATUS_CHANGE':
                                        return { text: 'Status Change', color: 'bg-purple-100 text-purple-800' };
                                      default:
                                        return { text: changeType, color: 'bg-gray-100 text-gray-800' };
                                    }
                                  };
                                  
                                  const changeTypeDisplay = getChangeTypeDisplay(log.changeType);
                                  
                                  const formatValue = (value: string | null, changeType: string) => {
                                    if (value === null) return '-';
                                    
                                    if (changeType === 'SUBMISSION') {
                                      try {
                                        const parsed = JSON.parse(value);
                                        return `Price: $${parsed.price}, Stock: ${parsed.stock}`;
                                      } catch {
                                        return value;
                                      }
                                    }
                                    
                                    if (changeType === 'PRICE_UPDATE') {
                                      return `$${value}`;
                                    }
                                    
                                    return value;
                                  };
                                  
                                  return (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${changeTypeDisplay.color}`}>
                                          {changeTypeDisplay.text}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatValue(log.previousValue, log.changeType)}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatValue(log.newValue, log.changeType)}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(log.createdAt).toLocaleString()}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                    
                    {tenantProducts.every(product => !(product as any).logs || (product as any).logs.length === 0) && (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500">No change logs available for your products</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}



        {/* Update Stock Modal */}
        {showUpdateStock && selectedProduct && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                {/* <h3 className="text-lg font-medium text-gray-900">Update Product</h3> */}
                <p className="text-sm text-gray-600 mt-1">{selectedProduct.name}</p>
              </div>
              
              <form onSubmit={handleUpdateStock} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={updateStockForm.price}
                      onChange={(e) => setUpdateStockForm({...updateStockForm, price: Number(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      required
                      value={updateStockForm.stock}
                      onChange={(e) => setUpdateStockForm({...updateStockForm, stock: Math.floor(Number(e.target.value))})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpdateStock(false);
                      setSelectedProduct(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingStock}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isUpdatingStock && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    <span>{isUpdatingStock ? 'Updating...' : 'Update Product'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Snackbar */}
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          isVisible={snackbar.isVisible}
          onClose={closeSnackbar}
        />



        {/* Product Details Modal */}

      </div>
    </div>
  );
};

export default TenantDashboard;