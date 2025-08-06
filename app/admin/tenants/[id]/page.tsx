'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Tenant } from '@/types/tenant';
import { mockTenants } from '@/data/mockData';
import { getRolePermissions } from '@/data/mockAuth';

export default function TenantDetailsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [tenant, setTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (user && !getRolePermissions(user.role).includes('tenants')) {
      router.push('/');
      return;
    }

    // Find the tenant by ID
    const tenantId = params.id as string;
    const foundTenant = mockTenants.find(t => t.id === tenantId);
    setTenant(foundTenant || null);
  }, [isAuthenticated, isLoading, user, router, params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !getRolePermissions(user.role).includes('tenants')) {
    return null; // Will redirect
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tenant Not Found</h1>
            <p className="text-gray-600 mb-6">The requested tenant could not be found.</p>
            <button
              onClick={() => router.push('/admin/tenants')}
              className="btn-primary"
            >
              Back to Tenant List
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full";
    
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Upcoming':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Expired':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadPaymentHistory = () => {
    if (!tenant || !tenant.rentPayments || tenant.rentPayments.length === 0) {
      alert('No payment history available for this tenant');
      return;
    }

    // Create CSV content
    const headers = ['Date', 'Amount', 'Payment Method', 'Status', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...tenant.rentPayments.map(payment => [
        new Date(payment.date).toLocaleDateString(),
        `$${payment.amount}`,
        payment.method,
        payment.status,
        payment.notes || ''
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `payment-history-${tenant.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push('/admin/tenants')}
                className="text-primary-600 hover:text-primary-800 mb-2 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Tenant List
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
              <p className="text-gray-600 mt-1">{tenant.businessName}</p>
            </div>
            <span className={getStatusBadge(tenant.status)}>
              {tenant.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-900">{tenant.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{tenant.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{tenant.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <p className="text-gray-900">{tenant.businessName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                  <p className="text-gray-900">{tenant.businessType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cube ID</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {tenant.cubeId}
                  </span>
                </div>
              </div>
            </div>

            {/* Lease Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Lease Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lease Start Date</label>
                  <p className="text-gray-900">{formatDate(tenant.leaseStartDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lease End Date</label>
                  <p className="text-gray-900">{formatDate(tenant.leaseEndDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
                  <p className="text-gray-900 text-lg font-semibold">{formatCurrency(tenant.monthlyRent || 0)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit</label>
                  <p className="text-gray-900">{formatCurrency(tenant.securityDeposit || 0)}</p>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
                {tenant.rentPayments && tenant.rentPayments.length > 0 && (
                  <button
                    onClick={downloadPaymentHistory}
                    className="btn-secondary flex items-center space-x-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download CSV</span>
                  </button>
                )}
              </div>
              {tenant.rentPayments && tenant.rentPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="table-header">Date</th>
                        <th className="table-header">Amount</th>
                        <th className="table-header">Method</th>
                        <th className="table-header">Status</th>
                        <th className="table-header">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tenant.rentPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="table-cell">{formatDate(payment.date)}</td>
                          <td className="table-cell font-medium">{formatCurrency(payment.amount)}</td>
                          <td className="table-cell capitalize">{payment.method}</td>
                          <td className="table-cell">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              payment.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="table-cell text-gray-500">{payment.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No payment history available</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Payments</span>
                  <span className="font-medium">{tenant.rentPayments?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Paid</span>
                  <span className="font-medium">
                    {formatCurrency(
                      tenant.rentPayments?.reduce((sum, payment) => 
                        payment.status === 'completed' ? sum + payment.amount : sum, 0
                      ) || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lease Duration</span>
                  <span className="font-medium">
                    {Math.ceil(
                      (new Date(tenant.leaseEndDate).getTime() - new Date(tenant.leaseStartDate).getTime()) 
                      / (1000 * 60 * 60 * 24 * 30)
                    )} months
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <a href={`mailto:${tenant.email}`} className="text-primary-600 hover:text-primary-800">
                    {tenant.email}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <a href={`tel:${tenant.phone}`} className="text-primary-600 hover:text-primary-800">
                    {tenant.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <button className="w-full btn-primary">
                  Send Message
                </button>
                <button className="w-full btn-secondary">
                  Generate Report
                </button>
                <button className="w-full btn-secondary">
                  View Lease Agreement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}