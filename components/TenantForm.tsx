'use client';

import { useState, useEffect } from 'react';
import { Tenant, TenantFormData } from '@/types/tenant';
import { availableCubes, calculateLeaseStatus } from '@/data/mockData';
import { tenantService } from '@/services/tenantService';

interface TenantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tenant: Tenant) => void;
  editingTenant?: Tenant | null;
}

const TenantForm = ({ isOpen, onClose, onSubmit, editingTenant }: TenantFormProps) => {
  const [formData, setFormData] = useState<TenantFormData>({
    name: '',
    email: '',
    password: tenantService.generateDefaultPassword(),
    businessName: '',
    contactNumber: '',
    address: '',
    notes: '',
    cubeId: '',
    leaseStartDate: '',
    leaseEndDate: '',
  });

  const [errors, setErrors] = useState<Partial<TenantFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  useEffect(() => {
    if (editingTenant) {
      setFormData({
        name: editingTenant.name,
        email: editingTenant.email,
        password: tenantService.generateDefaultPassword(),
        businessName: editingTenant.businessName,
        contactNumber: editingTenant.contactNumber,
        address: editingTenant.phone || '', // Use phone as address fallback for existing data
        notes: '',
        cubeId: editingTenant.cubeId,
        leaseStartDate: editingTenant.leaseStartDate,
        leaseEndDate: editingTenant.leaseEndDate,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: tenantService.generateDefaultPassword(),
        businessName: '',
        contactNumber: '',
        address: '',
        notes: '',
        cubeId: '',
        leaseStartDate: '',
        leaseEndDate: '',
      });
    }
    setErrors({});
    setApiError('');
  }, [editingTenant, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TenantFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.cubeId) newErrors.cubeId = 'Cube selection is required';
    if (!formData.leaseStartDate) newErrors.leaseStartDate = 'Start date is required';
    if (!formData.leaseEndDate) newErrors.leaseEndDate = 'End date is required';

    // Validate phone number format
    const phoneRegex = /^(\+61|0)[0-9]{9}$/;
    if (formData.contactNumber && !phoneRegex.test(formData.contactNumber.replace(/\s/g, ''))) {
      newErrors.contactNumber = 'Please enter a valid Australian phone number';
    }

    if (formData.leaseStartDate && formData.leaseEndDate) {
      if (new Date(formData.leaseStartDate) >= new Date(formData.leaseEndDate)) {
        newErrors.leaseEndDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    try {
      if (editingTenant) {
        // For editing, use the existing mock logic for now
        const status = calculateLeaseStatus(formData.leaseStartDate, formData.leaseEndDate);
        const tenant: Tenant = {
          id: editingTenant.id,
          ...formData,
          status,
          rentPayments: editingTenant.rentPayments || [],
        };
        onSubmit(tenant);
        onClose();
      } else {
        // For adding new tenant, use the API
        const apiData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: tenantService.formatPhoneNumber(formData.contactNumber),
          businessName: formData.businessName,
          address: formData.address,
          notes: formData.notes || '',
        };

        const response = await tenantService.addTenant(apiData);
        
        // Convert API response to local tenant format
        const status = calculateLeaseStatus(formData.leaseStartDate, formData.leaseEndDate);
        const tenant: Tenant = {
          id: response.id,
          name: response.name,
          email: response.email,
          businessName: response.tenants[0]?.businessName || formData.businessName,
          contactNumber: response.phone,
          cubeId: formData.cubeId,
          leaseStartDate: formData.leaseStartDate,
          leaseEndDate: formData.leaseEndDate,
          status,
          rentPayments: [],
          phone: response.phone,
        };

        onSubmit(tenant);
        onClose();
      }
    } catch (error) {
      console.error('Error submitting tenant:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to add tenant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof TenantFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear API error when user makes changes
    if (apiError) {
      setApiError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter tenant name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Enter password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className={`input-field ${errors.businessName ? 'border-red-500' : ''}`}
                placeholder="Enter business name"
              />
              {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number *
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className={`input-field ${errors.contactNumber ? 'border-red-500' : ''}`}
                placeholder="e.g., 0400123456 or +61400123456"
              />
              {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`input-field ${errors.address ? 'border-red-500' : ''}`}
                placeholder="Enter full address"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* <div>
              <label htmlFor="cubeId" className="block text-sm font-medium text-gray-700 mb-1">
                Cube *
              </label>
              <select
                id="cubeId"
                name="cubeId"
                value={formData.cubeId}
                onChange={handleInputChange}
                className={`input-field ${errors.cubeId ? 'border-red-500' : ''}`}
              >
                <option value="">Select a cube</option>
                {availableCubes.map((cube) => (
                  <option key={cube} value={cube}>
                    {cube}
                  </option>
                ))}
              </select>
              {errors.cubeId && <p className="text-red-500 text-xs mt-1">{errors.cubeId}</p>}
            </div> */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="leaseStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Lease Start *
                </label>
                <input
                  type="date"
                  id="leaseStartDate"
                  name="leaseStartDate"
                  value={formData.leaseStartDate}
                  onChange={handleInputChange}
                  className={`input-field ${errors.leaseStartDate ? 'border-red-500' : ''}`}
                />
                {errors.leaseStartDate && <p className="text-red-500 text-xs mt-1">{errors.leaseStartDate}</p>}
              </div>

              <div>
                <label htmlFor="leaseEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Lease End *
                </label>
                <input
                  type="date"
                  id="leaseEndDate"
                  name="leaseEndDate"
                  value={formData.leaseEndDate}
                  onChange={handleInputChange}
                  className={`input-field ${errors.leaseEndDate ? 'border-red-500' : ''}`}
                />
                {errors.leaseEndDate && <p className="text-red-500 text-xs mt-1">{errors.leaseEndDate}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
                rows={3}
                className="input-field resize-none"
                placeholder="Additional notes about the tenant (optional)"
              />
            </div>

            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{apiError}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading 
                  ? (editingTenant ? 'Updating...' : 'Adding...') 
                  : (editingTenant ? 'Update Tenant' : 'Add Tenant')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TenantForm;