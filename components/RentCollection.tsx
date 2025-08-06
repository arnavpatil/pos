'use client';

import { useState } from 'react';
import { Tenant, RentPayment } from '@/types/tenant';

interface RentCollectionProps {
  tenants: Tenant[];
  onAddPayment: (tenantId: string, payment: Omit<RentPayment, 'id' | 'tenantId'>) => void;
}

const RentCollection = ({ tenants, onAddPayment }: RentCollectionProps) => {
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<'Bank Transfer' | 'Card'>('Bank Transfer');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTenant || !amount || !date) {
      alert('Please fill in all fields');
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    onAddPayment(selectedTenant, {
      amount: paymentAmount,
      method,
      date,
    });

    // Reset form
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    alert('Payment recorded successfully!');
  };

  const selectedTenantData = tenants.find(t => t.id === selectedTenant);

  const getTotalPaid = (tenant: Tenant): number => {
    return tenant.rentPayments.reduce((total, payment) => total + payment.amount, 0);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount);
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Rent Collection</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="tenant-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Tenant
              </label>
              <select
                id="tenant-select"
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Choose a tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name} - {tenant.businessName} ({tenant.cubeId})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (AUD)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  id="method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as 'Bank Transfer' | 'Card')}
                  className="input-field"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={!selectedTenant}
            >
              Record Payment
            </button>
          </form>
        </div>

        {/* Tenant Payment Summary */}
        <div>
          {selectedTenantData && (
            <div className="space-y-4">
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <h3 className="font-medium text-primary-900 mb-2">Payment Summary</h3>
                <div className="text-sm text-primary-700 space-y-1">
                  <div><span className="font-medium">Tenant:</span> {selectedTenantData.name}</div>
                  <div><span className="font-medium">Business:</span> {selectedTenantData.businessName}</div>
                  <div><span className="font-medium">Cube:</span> {selectedTenantData.cubeId}</div>
                  <div><span className="font-medium">Total Paid:</span> {formatCurrency(getTotalPaid(selectedTenantData))}</div>
                  <div><span className="font-medium">Payments Made:</span> {selectedTenantData.rentPayments.length}</div>
                </div>
              </div>

              {/* Recent Payments */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Payment History</h4>
                {selectedTenantData.rentPayments.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <p className="text-sm text-gray-500 mt-2">No payments recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedTenantData.rentPayments
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                            <div className="text-sm text-gray-500">{payment.method}</div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(payment.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All Tenants Payment Overview */}
      <div className="mt-8">
        <h3 className="text-md font-medium text-gray-900 mb-4">All Tenants Payment Overview</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Tenant</th>
                <th className="table-header">Business</th>
                <th className="table-header">Cube</th>
                <th className="table-header">Total Paid</th>
                <th className="table-header">Payments</th>
                <th className="table-header">Last Payment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants.map((tenant) => {
                const lastPayment = tenant.rentPayments
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                
                return (
                  <tr 
                    key={tenant.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedTenant === tenant.id ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => setSelectedTenant(tenant.id)}
                  >
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">{tenant.name}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-gray-900">{tenant.businessName}</div>
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {tenant.cubeId}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">{formatCurrency(getTotalPaid(tenant))}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-gray-900">{tenant.rentPayments.length}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-gray-500">
                        {lastPayment ? new Date(lastPayment.date).toLocaleDateString() : 'No payments'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RentCollection;