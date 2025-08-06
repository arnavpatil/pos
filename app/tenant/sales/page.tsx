'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getRolePermissions } from '@/data/mockAuth';
import { mockSales, getSalesByTenant } from '@/data/mockSales';
import { Sale } from '@/types/sales';

const TenantSales = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth');
        return;
      }

      const permissions = getRolePermissions(user.role);
      if (!permissions.includes('tenant-sales')) {
        router.push('/');
        return;
      }

      if (user.tenantId) {
        const tenantSales = getSalesByTenant(user.tenantId);
        setSales(tenantSales);
        setFilteredSales(tenantSales);
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    let filtered = sales;

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(sale => new Date(sale.timestamp) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(sale => new Date(sale.timestamp) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(sale => new Date(sale.timestamp) >= filterDate);
          break;
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sale =>
        sale.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.items.some(item => 
          item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredSales(filtered);
  }, [sales, dateFilter, searchTerm]);

  const downloadSalesReport = () => {
    if (!user) return;

    const csvContent = "data:text/csv;charset=utf-8," + 
      "Sale Number,Date,Time,Product,Quantity,Unit Price,Total,Commission,Payment Method\n" +
      filteredSales.map(sale => {
        const tenantItems = sale.items.filter(item => item.tenantId === user.tenantId);
        return tenantItems.map(item => 
          `${sale.saleNumber},${new Date(sale.timestamp).toLocaleDateString()},${new Date(sale.timestamp).toLocaleTimeString()},${item.productName},${item.quantity},${item.unitPrice.toFixed(2)},${item.totalPrice.toFixed(2)},${item.commissionAmount.toFixed(2)},${sale.paymentMethod}`
        ).join("\n");
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_report_${user.artistId}_${new Date().toISOString().split('T')[0]}.csv`);
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

  if (!user || !user.tenantId) {
    return null;
  }

  // Calculate totals for filtered sales
  const totalRevenue = filteredSales.reduce((total, sale) => {
    const tenantItems = sale.items.filter(item => item.tenantId === user.tenantId);
    return total + tenantItems.reduce((itemTotal, item) => itemTotal + item.totalPrice, 0);
  }, 0);

  const totalCommission = filteredSales.reduce((total, sale) => {
    const tenantItems = sale.items.filter(item => item.tenantId === user.tenantId);
    return total + tenantItems.reduce((itemTotal, item) => itemTotal + item.commissionAmount, 0);
  }, 0);

  const totalItems = filteredSales.reduce((total, sale) => {
    const tenantItems = sale.items.filter(item => item.tenantId === user.tenantId);
    return total + tenantItems.reduce((itemTotal, item) => itemTotal + item.quantity, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Records</h1>
          <p className="text-gray-600 mt-2">Track your sales performance and download reports</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <p className="text-2xl font-semibold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div>
                <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Period
                </label>
                <select
                  id="dateFilter"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>

              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by sale number or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={downloadSalesReport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Excel
            </button>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Sales History ({filteredSales.length} transactions)
            </h3>
          </div>
          
          {filteredSales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sale Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSales.map((sale) => {
                    const tenantItems = sale.items.filter(item => item.tenantId === user.tenantId);
                    const saleRevenue = tenantItems.reduce((total, item) => total + item.totalPrice, 0);
                    const saleCommission = tenantItems.reduce((total, item) => total + item.commissionAmount, 0);
                    
                    return (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{sale.saleNumber}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(sale.timestamp).toLocaleDateString()} at {new Date(sale.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {tenantItems.map((item) => (
                              <div key={item.id} className="text-sm">
                                <span className="font-medium text-gray-900">{item.productName}</span>
                                <span className="text-gray-500 ml-2">×{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${saleRevenue.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ${saleCommission.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            sale.paymentStatus === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {sale.paymentMethod.toUpperCase()}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {sale.paymentStatus}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No sales found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || dateFilter !== 'all' 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Your sales will appear here once customers purchase your products.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantSales;