'use client';

import { useState } from 'react';
import { Tenant } from '@/types/tenant';
import { calculateLeaseStatus } from '@/data/mockData';

interface LeaseManagementProps {
  tenants: Tenant[];
  onUpdateLease: (tenantId: string, startDate: string, endDate: string) => void;
}

const LeaseManagement = ({ tenants, onUpdateLease }: LeaseManagementProps) => {
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenant(tenantId);
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setStartDate(tenant.leaseStartDate);
      setEndDate(tenant.leaseEndDate);
    }
  };

  const handleUpdateLease = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTenant && startDate && endDate) {
      if (new Date(startDate) >= new Date(endDate)) {
        alert('End date must be after start date');
        return;
      }
      onUpdateLease(selectedTenant, startDate, endDate);
      alert('Lease updated successfully!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Upcoming':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Expired':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const selectedTenantData = tenants.find(t => t.id === selectedTenant);

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Lease Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tenant Selection and Form */}
        <div>
          <form onSubmit={handleUpdateLease} className="space-y-4">
            <div>
              <label htmlFor="tenant-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Tenant
              </label>
              <select
                id="tenant-select"
                value={selectedTenant}
                onChange={(e) => handleTenantSelect(e.target.value)}
                className="input-field"
              >
                <option value="">Choose a tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name} - {tenant.businessName} ({tenant.cubeId})
                  </option>
                ))}
              </select>
            </div>

            {selectedTenant && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Lease Start Date
                    </label>
                    <input
                      type="date"
                      id="start-date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Lease End Date
                    </label>
                    <input
                      type="date"
                      id="end-date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  Update Lease
                </button>
              </>
            )}
          </form>
        </div>

        {/* Lease Status Display */}
        <div>
          {selectedTenantData && (
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Current Lease Information</h3>
              
              <div className={`p-4 rounded-lg border ${getStatusColor(selectedTenantData.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Lease Status</span>
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    {selectedTenantData.status}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <div>Start: {new Date(selectedTenantData.leaseStartDate).toLocaleDateString()}</div>
                  <div>End: {new Date(selectedTenantData.leaseEndDate).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Tenant Details</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><span className="font-medium">Name:</span> {selectedTenantData.name}</div>
                  <div><span className="font-medium">Business:</span> {selectedTenantData.businessName}</div>
                  <div><span className="font-medium">Cube:</span> {selectedTenantData.cubeId}</div>
                  <div><span className="font-medium">Email:</span> {selectedTenantData.email}</div>
                  <div><span className="font-medium">Contact:</span> {selectedTenantData.contactNumber}</div>
                </div>
              </div>

              {/* Live Status Calculation */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Live Status Check</h4>
                <div className="text-sm text-blue-700">
                  Current calculated status: <span className="font-semibold">
                    {calculateLeaseStatus(startDate, endDate)}
                  </span>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Based on today's date: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All Tenants Overview */}
      <div className="mt-8">
        <h3 className="text-md font-medium text-gray-900 mb-4">All Tenants Lease Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedTenant === tenant.id 
                  ? 'ring-2 ring-primary-500 border-primary-300' 
                  : getStatusColor(tenant.status)
              }`}
              onClick={() => handleTenantSelect(tenant.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-gray-900">{tenant.name}</div>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {tenant.status}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <div>{tenant.businessName}</div>
                <div className="mt-1">Cube: {tenant.cubeId}</div>
                <div className="mt-1 text-xs">
                  {new Date(tenant.leaseStartDate).toLocaleDateString()} - {new Date(tenant.leaseEndDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaseManagement;