'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getRolePermissions } from '@/data/mockAuth';
import { mockPaymentRecords, getPaymentsByTenant } from '@/data/mockSales';
import { PaymentRecord } from '@/types/sales';

const TenantPayments = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth');
        return;
      }

      const permissions = getRolePermissions(user.role);
      if (!permissions.includes('tenant-payments')) {
        router.push('/');
        return;
      }

      if (user.tenantId) {
        const tenantPayments = getPaymentsByTenant(user.tenantId);
        setPayments(tenantPayments);
      }
    }
  }, [user, isLoading, router]);

  const handlePayRent = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!selectedPayment) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Update payment status
      const updatedPayments = payments.map(p => 
        p.id === selectedPayment.id 
          ? { ...p, status: 'paid' as const, paidDate: new Date().toISOString() }
          : p
      );
      setPayments(updatedPayments);
      setIsProcessing(false);
      setShowPaymentModal(false);
      setSelectedPayment(null);
      
      // Show success message
      alert('Payment processed successfully! Confirmation email sent.');
    }, 2000);
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

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const paidPayments = payments.filter(p => p.status === 'paid');
  const overduePayments = payments.filter(p => {
    if (p.status !== 'pending') return false;
    return new Date(p.dueDate) < new Date();
  });

  const getStatusColor = (status: string, dueDate: string) => {
    if (status === 'paid') return 'bg-green-100 text-green-800';
    if (new Date(dueDate) < new Date()) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (status: string, dueDate: string) => {
    if (status === 'paid') return 'Paid';
    if (new Date(dueDate) < new Date()) return 'Overdue';
    return 'Pending';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Rent & Payments</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your rental payments and view payment history</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Pending Payments</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">{pendingPayments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Overdue</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">{overduePayments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Paid This Year</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">{paidPayments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Payments Alert */}
        {overduePayments.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-medium text-red-800">
                  You have {overduePayments.length} overdue payment{overduePayments.length > 1 ? 's' : ''}
                </h3>
                <p className="text-xs sm:text-sm text-red-700 mt-1">
                  Please pay immediately to avoid penalties and maintain your rental status.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Payment History</h3>
          </div>
          
          {payments.length > 0 ? (
            <>
              {/* Mobile View */}
              <div className="block sm:hidden">
                <div className="p-3 space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {payment.type === 'rent' ? 'Monthly Rent' : 'Commission Payment'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Period: {new Date(payment.startDate).toLocaleDateString()} - {payment.endDate ? new Date(payment.endDate).toLocaleDateString() : 'Ongoing'}
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2 ${getStatusColor(payment.status, payment.dueDate)}`}>
                          {getStatusText(payment.status, payment.dueDate)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">Due: {new Date(payment.dueDate).toLocaleDateString()}</div>
                          {payment.paidDate && (
                            <div className="text-xs text-gray-500">
                              Paid: {new Date(payment.paidDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          {payment.status === 'pending' ? (
                            <button
                              onClick={() => handlePayRent(payment)}
                              className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 active:bg-blue-800"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">Completed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {payment.type === 'rent' ? 'Monthly Rent' : 'Commission Payment'}
                            </div>
                            <div className="text-sm text-gray-500">
                              Period: {new Date(payment.startDate).toLocaleDateString()} - {payment.endDate ? new Date(payment.endDate).toLocaleDateString() : 'Ongoing'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status, payment.dueDate)}`}>
                            {getStatusText(payment.status, payment.dueDate)}
                          </span>
                          {payment.paidDate && (
                            <div className="text-xs text-gray-500 mt-1">
                              Paid: {new Date(payment.paidDate).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {payment.status === 'pending' ? (
                            <button
                              onClick={() => handlePayRent(payment)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <span className="text-gray-400">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payment records</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your payment history will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-md sm:w-96 shadow-lg rounded-md bg-white">
            <div className="mt-2 sm:mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Process Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-600">Payment Details</div>
                <div className="font-medium text-gray-900 text-sm sm:text-base">
                  {selectedPayment.type === 'rent' ? 'Monthly Rent' : 'Commission Payment'}
                </div>
                <div className="text-lg sm:text-xl font-bold text-gray-900">${selectedPayment.amount.toFixed(2)}</div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Due: {new Date(selectedPayment.dueDate).toLocaleDateString()}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 active:bg-gray-400"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantPayments;