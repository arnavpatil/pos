'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import TenantList from '@/components/TenantList';
import TenantForm from '@/components/TenantForm';
import LeaseManagement from '@/components/LeaseManagement';
import RentCollection from '@/components/RentCollection';
import { Tenant, TenantFormData, RentPayment } from '@/types/tenant';
import { mockTenants, mockRentPayments } from '@/data/mockData';
import { getRolePermissions } from '@/data/mockAuth';
import { calculateLeaseStatus } from '@/data/mockData';

type TabType = 'list' | 'lease' | 'rent';

export default function TenantsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (user && !getRolePermissions(user.role).includes('tenants')) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, isLoading, user, router]);

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

  const handleAddTenant = () => {
    setEditingTenant(null);
    setIsFormOpen(true);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsFormOpen(true);
  };

  const handleDeleteTenant = (tenantId: string) => {
    setTenants(prev => prev.filter(tenant => tenant.id !== tenantId));
  };

  const handleSubmitTenant = (tenant: Tenant) => {
    if (editingTenant) {
      // Update existing tenant
      setTenants(prev => prev.map(t => t.id === tenant.id ? tenant : t));
    } else {
      // Add new tenant
      setTenants(prev => [...prev, tenant]);
    }
  };

  const handleUpdateLease = (tenantId: string, startDate: string, endDate: string) => {
    setTenants(prev => prev.map(tenant => {
      if (tenant.id === tenantId) {
        const status = calculateLeaseStatus(startDate, endDate);
        return {
          ...tenant,
          leaseStartDate: startDate,
          leaseEndDate: endDate,
          status
        };
      }
      return tenant;
    }));
  };

  const handleAddPayment = (tenantId: string, payment: Omit<RentPayment, 'id' | 'tenantId'>) => {
    const newPayment: RentPayment = {
      ...payment,
      id: `payment-${Date.now()}`,
      tenantId
    };

    setTenants(prev => prev.map(tenant => {
      if (tenant.id === tenantId) {
        return {
          ...tenant,
          rentPayments: [...tenant.rentPayments, newPayment]
        };
      }
      return tenant;
    }));
  };

  const tabs = [
    { id: 'list' as TabType, name: 'Tenant List', icon: '👥' },
    { id: 'lease' as TabType, name: 'Lease Management', icon: '📋' },
    { id: 'rent' as TabType, name: 'Rent Collection', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tenant & Rental Management</h1>
          <p className="text-gray-600 mt-1">Manage tenants, leases, and rent collection for Cornven cube spaces</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'list' && (
            <TenantList
              tenants={tenants}
              onEdit={handleEditTenant}
              onDelete={handleDeleteTenant}
              onAddNew={handleAddTenant}
            />
          )}

          {activeTab === 'lease' && (
            <LeaseManagement
              tenants={tenants}
              onUpdateLease={handleUpdateLease}
            />
          )}

          {activeTab === 'rent' && (
            <RentCollection
              tenants={tenants}
              onAddPayment={handleAddPayment}
            />
          )}
        </div>

        {/* Statistics Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-primary-600">{tenants.length}</div>
            <div className="text-sm text-gray-600">Total Tenants</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {tenants.filter(t => t.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600">Active Leases</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {tenants.filter(t => t.status === 'Upcoming').length}
            </div>
            <div className="text-sm text-gray-600">Upcoming Leases</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {tenants.filter(t => t.status === 'Expired').length}
            </div>
            <div className="text-sm text-gray-600">Expired Leases</div>
          </div>
        </div>
      </div>

      {/* Tenant Form Modal */}
      <TenantForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitTenant}
        editingTenant={editingTenant}
      />
    </div>
  );
}