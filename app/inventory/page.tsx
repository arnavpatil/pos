'use client';

import React, { useState, useMemo, useRef } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  BarChart3, 
  AlertTriangle,
  Truck,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  QrCode,
  Users,
  TrendingDown,
  Calendar,
  User,
  ArrowLeft,
  ShoppingBag,
  DollarSign
} from 'lucide-react';
import { 
  mockProducts, 
  mockCategories, 
  mockInventoryChanges, 
  mockLowStockAlerts,
  mockDeliveryLogs,
  filterProducts,
  exportProductsToCSV,
  importProductsFromCSV,
  generateBarcode,
  generateSKU,
  getProductsByTenant
} from '@/data/mockProducts';
import { mockTenants } from '@/data/mockData';
import { Product, InventoryChange, DeliveryLog, InventoryFilter } from '@/types/product';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function InventoryPage() {
  const { user } = useAuth();
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [filters, setFilters] = useState<InventoryFilter>({
    category: '',
    tenantId: '',
    stockStatus: '',
    priceRange: { min: undefined, max: undefined }
  });

  // Get artist products for selected artist
  const artistProducts = selectedArtist ? getProductsByTenant(selectedArtist) : [];
  
  // Calculate stats for selected artist
  const artistStats = useMemo(() => {
    if (!selectedArtist) return null;
    
    const products = artistProducts;
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const outOfStock = products.filter(p => p.stock === 0).length;
    
    return { totalProducts, lowStockCount, totalValue, outOfStock };
  }, [selectedArtist, artistProducts]);

  // Get unique artists with their product counts
  const artistsWithStats = useMemo(() => {
    const artistMap = new Map();
    
    mockTenants.forEach(tenant => {
      const products = getProductsByTenant(tenant.id);
      const totalProducts = products.length;
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
      const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
      
      artistMap.set(tenant.id, {
        ...tenant,
        totalProducts,
        totalValue,
        lowStockCount
      });
    });
    
    return Array.from(artistMap.values());
  }, []);

  const handleExport = () => {
    const csvContent = exportProductsToCSV(artistProducts);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target?.result as string;
        const result = importProductsFromCSV(csvData);
        console.log('Import result:', result);
        alert(`Import completed: ${result.successfulRows} successful, ${result.failedRows} failed`);
      };
      reader.readAsText(file);
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">{product.name}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">{product.tenantName}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="truncate">SKU: {product.sku}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline truncate">{product.barcode}</span>
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0 ml-2">
          <button
            onClick={() => {
              setSelectedProduct(product);
              setShowProductDetails(true);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-500">Price</p>
          <p className="font-semibold text-green-600 text-sm sm:text-base">${product.price}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Stock</p>
          <p className={`font-semibold text-sm sm:text-base ${product.stock <= product.lowStockThreshold ? 'text-red-600' : 'text-gray-900'}`}>
            {product.stock}
            {product.stock <= product.lowStockThreshold && (
              <AlertTriangle className="w-3 h-3 inline ml-1" />
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
          product.status === 'active' ? 'bg-green-100 text-green-800' :
          product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {product.status}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${
          product.deliveryMethod === 'handover' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {product.deliveryMethod}
        </span>
      </div>
    </div>
  );

  const InventoryChangeRow = ({ change }: { change: InventoryChange }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
        <div className="truncate max-w-[120px] sm:max-w-none">{change.productName}</div>
      </td>
      <td className="px-3 sm:px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          change.changeType === 'stock_in' ? 'bg-green-100 text-green-800' :
          change.changeType === 'stock_out' || change.changeType === 'sale' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {change.changeType}
        </span>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
        {change.changeType === 'stock_in' ? '+' : (change.changeType === 'stock_out' || change.changeType === 'sale') ? '-' : ''}
        {change.quantity}
      </td>
      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">{change.previousStock}</td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{change.newStock}</td>
      <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-500">
        <div className="truncate max-w-[150px]">{change.reason}</div>
      </td>
      <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-500">
        <div className="truncate max-w-[100px]">{change.userName}</div>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
        {new Date(change.timestamp).toLocaleDateString()}
      </td>
    </tr>
  );

  const DeliveryLogRow = ({ delivery }: { delivery: DeliveryLog }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
        <div className="truncate max-w-[120px] sm:max-w-none">{delivery.productName}</div>
      </td>
      <td className="px-3 sm:px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          delivery.deliveryMethod === 'handover' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {delivery.deliveryMethod}
        </span>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{delivery.quantity}</td>
      <td className="px-3 sm:px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
          delivery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {delivery.status}
        </span>
      </td>
      <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-500">
        <div className="truncate max-w-[100px]">{delivery.deliveredBy}</div>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
        {new Date(delivery.deliveryDate).toLocaleDateString()}
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0 flex-1">
              {selectedArtist && (
                <button
                  onClick={() => setSelectedArtist(null)}
                  className="mr-2 sm:mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                  <Package className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-2 sm:mr-3 text-blue-600 flex-shrink-0" />
                  <span className="truncate">
                    {selectedArtist ? 
                      `${mockTenants.find(t => t.id === selectedArtist)?.name} - Inventory` : 
                      'Inventory Management'
                    }
                  </span>
                </h1>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                  {selectedArtist ? 
                    'Manage products for this artist' : 
                    'Select an artist to view their inventory'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {!selectedArtist ? (
          // Artist Cards View
          <div>
            {/* Overall Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
                <div className="flex items-center">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600 flex-shrink-0" />
                  <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Artists</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{artistsWithStats.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
                <div className="flex items-center">
                  <Package className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600 flex-shrink-0" />
                  <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Products</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {artistsWithStats.reduce((sum, artist) => sum + artist.totalProducts, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
                <div className="flex items-center">
                  <TrendingDown className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-600 flex-shrink-0" />
                  <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Low Stock</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {artistsWithStats.reduce((sum, artist) => sum + artist.lowStockCount, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
                <div className="flex items-center">
                  <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600 flex-shrink-0" />
                  <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Value</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      ${artistsWithStats.reduce((sum, artist) => sum + artist.totalValue, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Artist Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {artistsWithStats.map(artist => (
                <div
                  key={artist.id}
                  onClick={() => setSelectedArtist(artist.id)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-blue-300 active:bg-gray-50"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{artist.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{artist.email}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-xs font-medium ${
                          artist.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {artist.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                        </div>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">{artist.totalProducts}</p>
                        <p className="text-xs text-gray-600">Products</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        </div>
                        <p className="text-lg sm:text-2xl font-bold text-green-600">${artist.totalValue.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Value</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                        </div>
                        <p className="text-lg sm:text-2xl font-bold text-red-600">{artist.lowStockCount}</p>
                        <p className="text-xs text-gray-600">Low Stock</p>
                      </div>
                    </div>
                    
                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                      <button className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm active:text-blue-800">
                        View Inventory →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Selected Artist Inventory View
          <div>
            {/* Artist Stats */}
            {artistStats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center">
                    <Package className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600 flex-shrink-0" />
                    <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Products</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{artistStats.totalProducts}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center">
                    <TrendingDown className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-600 flex-shrink-0" />
                    <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Low Stock Items</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{artistStats.lowStockCount}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-orange-600 flex-shrink-0" />
                    <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Out of Stock</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{artistStats.outOfStock}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center">
                    <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600 flex-shrink-0" />
                    <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Value</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">${artistStats.totalValue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4 sm:space-x-8 px-3 sm:px-6 overflow-x-auto">
                  {[
                    { id: 'products', name: 'Products', icon: Package },
                    { id: 'changes', name: 'Inventory Changes', icon: BarChart3 },
                    { id: 'deliveries', name: 'Delivery Logs', icon: Truck },
                    { id: 'alerts', name: 'Low Stock Alerts', icon: AlertTriangle }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center flex-shrink-0`}
                    >
                      <tab.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">{tab.name}</span>
                      <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div>
                  {/* Search and Filters */}
                  <div className="p-3 sm:p-6 border-b border-gray-200">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center text-sm flex-1 sm:flex-none justify-center"
                          >
                            <Filter className="w-4 h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Filters</span>
                            <span className="sm:hidden">Filter</span>
                          </button>
                          
                          <button
                            onClick={() => setShowAddProduct(true)}
                            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm flex-1 sm:flex-none justify-center"
                          >
                            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Add Product</span>
                            <span className="sm:hidden">Add</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Secondary Actions - Mobile Friendly */}
                      <div className="flex gap-2 sm:justify-end">
                        <button
                          onClick={handleExport}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center text-sm flex-1 sm:flex-none justify-center"
                        >
                          <Download className="w-4 h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Export</span>
                          <span className="sm:hidden">Export</span>
                        </button>
                        
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center text-sm flex-1 sm:flex-none justify-center"
                        >
                          <Upload className="w-4 h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Import</span>
                          <span className="sm:hidden">Import</span>
                        </button>
                        
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={handleImport}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                              value={filters.category}
                              onChange={(e) => setFilters({...filters, category: e.target.value})}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            >
                              <option value="">All Categories</option>
                              {mockCategories.map(category => (
                                <option key={category.id} value={category.name}>{category.name}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                            <select
                              value={filters.stockStatus}
                              onChange={(e) => setFilters({...filters, stockStatus: e.target.value as any})}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            >
                              <option value="">All Stock Levels</option>
                              <option value="low">Low Stock</option>
                              <option value="normal">Normal Stock</option>
                              <option value="out">Out of Stock</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                placeholder="Min"
                                value={filters.priceRange?.min || ''}
                                onChange={(e) => setFilters({
                                  ...filters, 
                                  priceRange: {...(filters.priceRange || {}), min: Number(e.target.value) || undefined}
                                })}
                                className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
                              />
                              <input
                                type="number"
                                placeholder="Max"
                                value={filters.priceRange?.max || ''}
                                onChange={(e) => setFilters({
                                  ...filters, 
                                  priceRange: {...(filters.priceRange || {}), max: Number(e.target.value) || undefined}
                                })}
                                className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-3 sm:mt-4">
                          <button
                            onClick={() => {
                              setFilters({
                                category: '',
                                tenantId: '',
                                stockStatus: '',
                                priceRange: { min: undefined, max: undefined }
                              });
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                          >
                            Clear Filters
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Products Grid */}
                  <div className="p-3 sm:p-6">
                    {artistProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        {artistProducts
                          .filter(product => {
                            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                product.barcode.includes(searchQuery);
                            const matchesCategory = !filters.category || product.category === filters.category;
                            const matchesStock = !filters.stockStatus || 
                              (filters.stockStatus === 'low' && product.stock <= product.lowStockThreshold) ||
                              (filters.stockStatus === 'normal' && product.stock > product.lowStockThreshold) ||
                              (filters.stockStatus === 'out' && product.stock === 0);
                            const matchesPrice = (!filters.priceRange?.min || product.price >= filters.priceRange.min) &&
                                               (!filters.priceRange?.max || product.price <= filters.priceRange.max);
                            
                            return matchesSearch && matchesCategory && matchesStock && matchesPrice;
                          })
                          .map(product => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 sm:py-12">
                        <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-sm sm:text-base text-gray-500">This artist has no approved products yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Inventory Changes Tab */}
              {activeTab === 'changes' && (
                <div className="p-3 sm:p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Stock</th>
                          <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                          <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockInventoryChanges
                          .filter(change => artistProducts.some(p => p.id === change.productId))
                          .map(change => (
                            <InventoryChangeRow key={change.id} change={change} />
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Delivery Logs Tab */}
              {activeTab === 'deliveries' && (
                <div className="p-3 sm:p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered By</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockDeliveryLogs
                          .filter(delivery => artistProducts.some(p => p.id === delivery.productId))
                          .map(delivery => (
                            <DeliveryLogRow key={delivery.id} delivery={delivery} />
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="p-3 sm:p-6">
                  <div className="space-y-4">
                    {mockLowStockAlerts
                      .filter(alert => alert.tenantId === selectedArtist)
                      .map(alert => (
                        <div className={`p-3 sm:p-4 rounded-lg border ${
                          alert.acknowledged ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center min-w-0 flex-1">
                              <AlertTriangle className={`w-5 h-5 mr-3 flex-shrink-0 ${
                                alert.acknowledged ? 'text-gray-400' : 'text-red-500'
                              }`} />
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-gray-900 truncate">{alert.productName}</h3>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  Current stock: {alert.currentStock} (Threshold: {alert.threshold})
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
                              <span className="text-xs sm:text-sm text-gray-500">
                                {new Date(alert.createdAt).toLocaleDateString()}
                              </span>
                              {!alert.acknowledged && (
                                <button className="px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded hover:bg-blue-700 active:bg-blue-800">
                                  Acknowledge
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Details Modal */}
        {showProductDetails && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-3 sm:mx-0">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Product Details</h2>
                  <button
                    onClick={() => setShowProductDetails(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl p-1 hover:bg-gray-100 rounded"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-500">Name</label>
                        <p className="font-medium">{selectedProduct.name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">SKU</label>
                        <p className="font-medium">{selectedProduct.sku}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Barcode</label>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{selectedProduct.barcode}</p>
                          <QrCode className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Category</label>
                        <p className="font-medium">{selectedProduct.category}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Description</label>
                        <p className="font-medium">{selectedProduct.description || 'No description'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Inventory & Pricing</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-500">Price</label>
                        <p className="font-medium text-green-600">${selectedProduct.price}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Current Stock</label>
                        <p className={`font-medium ${selectedProduct.stock <= selectedProduct.lowStockThreshold ? 'text-red-600' : 'text-gray-900'}`}>
                          {selectedProduct.stock}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Low Stock Threshold</label>
                        <p className="font-medium">{selectedProduct.lowStockThreshold}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Commission Rate</label>
                        <p className="font-medium">{selectedProduct.commissionRate}%</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Delivery Method</label>
                        <p className="font-medium capitalize">{selectedProduct.deliveryMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4">Artist Information</h3>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="font-medium">{selectedProduct.tenantName}</p>
                    <p className="text-sm text-gray-600">Tenant ID: {selectedProduct.tenantId}</p>
                  </div>
                </div>
                
                {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                  <div className="mt-4 sm:mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}