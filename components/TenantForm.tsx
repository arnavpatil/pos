'use client';

import { useState, useEffect } from 'react';
import { Tenant, TenantFormData } from '@/types/tenant';
import { availableCubes, calculateLeaseStatus } from '@/data/mockData';

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
    businessName: '',
    contactNumber: '',
    cubeId: '',
    leaseStartDate: '',
    leaseEndDate: '',
  });

  const [errors, setErrors] = useState<Partial<TenantFormData>>({});

  useEffect(() => {
    if (editingTenant) {
      setFormData({
        name: editingTenant.name,
        email: editingTenant.email,
        businessName: editingTenant.businessName,
        contactNumber: editingTenant.contactNumber,
        cubeId: editingTenant.cubeId,
        leaseStartDate: editingTenant.leaseStartDate,
        leaseEndDate: editingTenant.leaseEndDate,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        businessName: '',
        contactNumber: '',
        cubeId: '',
        leaseStartDate: '',
        leaseEndDate: '',
      });
    }
    setErrors({});
  }, [editingTenant, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TenantFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.cubeId) newErrors.cubeId = 'Cube selection is required';
    if (!formData.leaseStartDate) newErrors.leaseStartDate = 'Start date is required';
    if (!formData.leaseEndDate) newErrors.leaseEndDate = 'End date is required';

    if (formData.leaseStartDate && formData.leaseEndDate) {
      if (new Date(formData.leaseStartDate) >= new Date(formData.leaseEndDate)) {
        newErrors.leaseEndDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const status = calculateLeaseStatus(formData.leaseStartDate, formData.leaseEndDate);

    const tenant: Tenant = {
      id: editingTenant?.id || `tenant-${Date.now()}`,
      ...formData,
      status,
      rentPayments: editingTenant?.rentPayments || [],
    };

    onSubmit(tenant);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof TenantFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
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
                placeholder="Enter contact number"
              />
              {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
            </div>

            <div>
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
            </div>

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
                className="btn-primary"
              >
                {editingTenant ? 'Update Tenant' : 'Add Tenant'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TenantForm;