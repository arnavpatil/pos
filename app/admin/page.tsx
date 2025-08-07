'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getRolePermissions } from '@/data/mockAuth';
import { mockDashboardStats } from '@/data/mockSales';
import { mockProducts, getProductsByCategory, getLowStockProducts } from '@/data/mockProducts';
import { mockPaymentRecords } from '@/data/mockSales';
import { DashboardStats } from '@/types/sales';
import { Product } from '@/types/product';
import { PaymentRecord } from '@/types/sales';

const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentPayments, setRecentPayments] = useState<PaymentRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth');
        return;
      }

      const permissions = getRolePermissions(user.role);
      if (!permissions.includes('admin-dashboard')) {
        router.push('/');
        return;
      }

      // Load dashboard data
      setStats(mockDashboardStats);
      setLowStockProducts(getLowStockProducts());
      
      // Get recent payments (last 10)
      const sortedPayments = [...mockPaymentRecords]
        .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
        .slice(0, 10);
      setRecentPayments(sortedPayments);
    }
  }, [user, isLoading, router]);

  const downloadPaymentHistory = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Tenant ID,Tenant Name,Type,Amount,Due Date,Status,Paid Date\n" +
      mockPaymentRecords.map(payment => 
        `${payment.tenantId},${payment.tenantName},${payment.type},${payment.amount},${payment.dueDate},${payment.status},${payment.paidDate || ''}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payment_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadProductCatalog = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Category,Price,Stock,Barcode,Tenant ID,Commission Rate,Status\n" +
      mockProducts.map(product => 
        `"${product.name}",${product.category},${product.price},${product.stock},${product.barcode},${product.tenantId},${product.commissionRate},${product.status}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `product_catalog_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation component needs to be imported and defined */}
      {/* Temporarily removing Navigation component until it is properly imported */}
      <div className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Overview of store performance and management tools</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Sales</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.totalSales}</p>
                <p className="text-xs text-green-600">+8% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Active Products</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.activeProducts}</p>
                <p className="text-xs text-blue-600">{lowStockProducts.length} low stock</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Active Tenants</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.activeTenants}</p>
                <p className="text-xs text-gray-500">5 spaces available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={downloadPaymentHistory}
              className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate">Download Payment History</span>
            </button>
            
            <button
              onClick={downloadProductCatalog}
              className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate">Export Product Catalog</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/products')}
              className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="truncate">Manage Products</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/sales')}
              className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="truncate">View Sales Reports</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Low Stock Alerts */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Low Stock Alerts</h3>
            </div>
            <div className="p-4 sm:p-6">
              {lowStockProducts.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{product.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">Stock: {product.stock} units</p>
                        <p className="text-xs text-gray-500 truncate">Tenant: {product.tenantId}</p>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Low Stock
                        </span>
                      </div>
                    </div>
                  ))}
                  {lowStockProducts.length > 5 && (
                    <p className="text-xs sm:text-sm text-gray-500 text-center">
                      +{lowStockProducts.length - 5} more items need restocking
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No low stock alerts</p>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Recent Payments</h3>
            </div>
            <div className="p-4 sm:p-6">
              {recentPayments.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {recentPayments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                          {payment.type === 'rent' ? 'Rent Payment' : 'Commission'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Tenant: {payment.tenantName}</p>
                        <p className="text-xs text-gray-500">
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base">${payment.amount.toFixed(2)}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'paid' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No recent payments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;