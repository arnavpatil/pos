'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getRolePermissions } from '@/data/mockAuth';

// Agent Portal Components
import AgentDashboard from '@/components/agent-portal/AgentDashboard';
import TenantManagement from '@/components/agent-portal/TenantManagement';
import ProductInventory from '@/components/agent-portal/ProductInventory';
import POSSystem from '@/components/agent-portal/POSSystem';
import ReportsAnalytics from '@/components/agent-portal/ReportsAnalytics';
import NotificationCenter from '@/components/agent-portal/NotificationCenter';
import CubeManagement from '@/components/agent-portal/CubeManagement';
import DisputeManagement from '@/components/agent-portal/DisputeManagement';
import ReservationSystem from '@/components/agent-portal/ReservationSystem';

type TabType = 'dashboard' | 'tenants' | 'inventory' | 'pos' | 'reports' | 'notifications' | 'cubes' | 'disputes' | 'reservations';

const AgentPortal = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth');
        return;
      }

      const permissions = getRolePermissions(user.role);
      if (!permissions.includes('admin-access') && !permissions.includes('staff-access')) {
        router.push('/');
        return;
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'tenants', name: 'Tenant Management', icon: '👥' },
    { id: 'inventory', name: 'Product Inventory', icon: '📦' },
    { id: 'pos', name: 'POS System', icon: '💳' },
    { id: 'cubes', name: 'Cube Management', icon: '🏢' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈' },
    { id: 'reservations', name: 'Reservations', icon: '📅' },
    { id: 'disputes', name: 'Disputes', icon: '⚠️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔', badge: notifications },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AgentDashboard />;
      case 'tenants':
        return <TenantManagement />;
      case 'inventory':
        return <ProductInventory />;
      case 'pos':
        return <POSSystem />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'notifications':
        return <NotificationCenter />;
      case 'cubes':
        return <CubeManagement />;
      case 'disputes':
        return <DisputeManagement />;
      case 'reservations':
        return <ReservationSystem />;
      default:
        return <AgentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Cornven Agent Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                    ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                  {tab.badge && tab.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AgentPortal;