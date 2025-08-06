'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getRolePermissions } from '@/data/mockAuth';
import { mockProducts, getProductsByTenant, getLowStockProducts } from '@/data/mockProducts';
import { mockSales, getSalesByTenant, getPaymentsByTenant, getTenantCommissionTotal } from '@/data/mockSales';
import { mockPaymentRecords } from '@/data/mockSales';
import { Product } from '@/types/product';
import { Sale, PaymentRecord } from '@/types/sales';

const TenantDashboard = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [tenantProducts, setTenantProducts] = useState<Product[]>([]);
  const [tenantSales, setTenantSales] = useState<Sale[]>([]);
  const [tenantPayments, setTenantPayments] = useState<PaymentRecord[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [totalCommission, setTotalCommission] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth');
        return;
      }

      const permissions = getRolePermissions(user.role);
      if (!permissions.includes('tenant-dashboard')) {
        router.push('/');
        return;
      }

      if (user.tenantId) {
        // Load tenant-specific data
        const products = getProductsByTenant(user.tenantId);
        const sales = getSalesByTenant(user.tenantId);
        const payments = getPaymentsByTenant(user.tenantId);
        const lowStock = products.filter(p => p.stock <= p.lowStockThreshold);
        const commission = getTenantCommissionTotal(user.tenantId);

        setTenantProducts(products);
        setTenantSales(sales);
        setTenantPayments(payments);
        setLowStockProducts(lowStock);
        setTotalCommission(commission);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !user.tenantId) {
    return null;
  }

  const recentSales = tenantSales.slice(0, 5);
  const pendingPayments = tenantPayments.filter(p => p.status === 'pending');
  const upcomingRentDue = tenantPayments.find(p => p.type === 'rent' && p.status === 'pending');

  const totalRevenue = tenantSales.reduce((total, sale) => {
    const tenantItems = sale.items.filter(item => item.tenantId === user.tenantId);
    return total + tenantItems.reduce((itemTotal, item) => itemTotal + item.totalPrice, 0);
  }, 0);

  const totalItemsSold = tenantSales.reduce((total, sale) => {
    const tenantItems = sale.items.filter(item => item.tenantId === user.tenantId);
    return total + tenantItems.reduce((itemTotal, item) => itemTotal + item.quantity, 0);
  }, 0);

  // Best selling products
  const productSales = new Map();
  tenantSales.forEach(sale => {
    sale.items.filter(item => item.tenantId === user.tenantId).forEach(item => {
      const existing = productSales.get(item.productId) || { name: item.productName, quantity: 0, revenue: 0 };
      existing.quantity += item.quantity;
      existing.revenue += item.totalPrice;
      productSales.set(item.productId, existing);
    });
  });

  const bestSellingProducts = Array.from(productSales.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Artist ID: {user.artistId} | Tenant Dashboard
          </p>
        </div>

        {/* Alerts */}
        {(lowStockProducts.length > 0 || upcomingRentDue) && (
          <div className="mb-6 space-y-4">
            {lowStockProducts.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Low Stock Alert
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>{lowStockProducts.length} product(s) are running low on stock:</p>
                      <ul className="list-disc list-inside mt-1">
                        {lowStockProducts.map(product => (
                          <li key={product.id}>
                            {product.name} (Stock: {product.stock})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {upcomingRentDue && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Rent Payment Due
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>Rent payment of ${upcomingRentDue.amount} is due on {new Date(upcomingRentDue.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                <p className="text-2xl font-semibold text-gray-900">${totalCommission.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Items Sold</p>
                <p className="text-2xl font-semibold text-gray-900">{totalItemsSold}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H15a2 2 0 012 2v0M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-semibold text-gray-900">{tenantProducts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Sales */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Sales</h3>
            </div>
            <div className="p-6">
              {recentSales.length > 0 ? (
                <div className="space-y-4">
                  {recentSales.map((sale) => {
                    const tenantItems = sale.items.filter(item => item.tenantId === user.tenantId);
                    const saleTotal = tenantItems.reduce((total, item) => total + item.totalPrice, 0);
                    
                    return (
                      <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{sale.saleNumber}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(sale.timestamp).toLocaleDateString()} - {tenantItems.length} item(s)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${saleTotal.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{sale.paymentMethod}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No sales yet</p>
              )}
            </div>
          </div>

          {/* Best Selling Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Best Selling Products</h3>
            </div>
            <div className="p-6">
              {bestSellingProducts.length > 0 ? (
                <div className="space-y-4">
                  {bestSellingProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.quantity} sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${product.revenue.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No sales data available</p>
              )}
            </div>
          </div>

          {/* Stock Levels */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Stock Levels</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {tenantProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${product.stock <= product.lowStockThreshold ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock} units
                      </p>
                      <p className="text-sm text-gray-600">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => router.push('/tenant/products')}
                  className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm font-medium text-blue-600">Add Product</p>
                </button>
                
                <button 
                  onClick={() => router.push('/tenant/sales')}
                  className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-sm font-medium text-green-600">View Sales</p>
                </button>
                
                <button 
                  onClick={() => router.push('/tenant/payments')}
                  className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <p className="text-sm font-medium text-purple-600">Payments</p>
                </button>
                
                <button 
                  onClick={() => {
                    // Download sales report functionality
                    const csvContent = "data:text/csv;charset=utf-8," + 
                      "Sale Number,Date,Items,Total,Commission\n" +
                      tenantSales.map(sale => {
                        const tenantItems = sale.items.filter(item => item.tenantId === user.tenantId);
                        const saleTotal = tenantItems.reduce((total, item) => total + item.totalPrice, 0);
                        const commission = tenantItems.reduce((total, item) => total + item.commissionAmount, 0);
                        return `${sale.saleNumber},${new Date(sale.timestamp).toLocaleDateString()},${tenantItems.length},${saleTotal.toFixed(2)},${commission.toFixed(2)}`;
                      }).join("\n");
                    
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `sales_report_${user.artistId}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-orange-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm font-medium text-orange-600">Download Report</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;