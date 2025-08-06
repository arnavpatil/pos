'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleDisplayName, getRolePermissions } from '@/data/mockAuth';

const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  if (!user) return null;

  const userPermissions = getRolePermissions(user.role);

  const getNavItems = () => {
    const baseItems = [];
    
    // Admin items
    if (userPermissions.includes('admin-dashboard')) {
      baseItems.push({ name: 'Dashboard', href: '/admin', permission: 'admin-dashboard' });
    }
    if (userPermissions.includes('admin-products')) {
      baseItems.push({ name: 'Products', href: '/admin/products', permission: 'admin-products' });
    }
    if (userPermissions.includes('admin-sales')) {
      baseItems.push({ name: 'Sales', href: '/admin/sales', permission: 'admin-sales' });
    }
    
    // Tenant items
    if (userPermissions.includes('tenant-dashboard')) {
      baseItems.push({ name: 'Dashboard', href: '/tenant', permission: 'tenant-dashboard' });
    }
    if (userPermissions.includes('tenant-products')) {
      baseItems.push({ name: 'My Products', href: '/tenant/products', permission: 'tenant-products' });
    }
    if (userPermissions.includes('tenant-sales')) {
      baseItems.push({ name: 'My Sales', href: '/tenant/sales', permission: 'tenant-sales' });
    }
    if (userPermissions.includes('tenant-payments')) {
      baseItems.push({ name: 'Payments', href: '/tenant/payments', permission: 'tenant-payments' });
    }
    
    // Common items
    if (userPermissions.includes('pos')) {
      baseItems.push({ name: 'POS', href: '/pos', permission: 'pos' });
    }
    if (userPermissions.includes('inventory')) {
      baseItems.push({ name: 'Inventory', href: '/inventory', permission: 'inventory' });
    }
    if (userPermissions.includes('reports')) {
      baseItems.push({ name: 'Reports', href: '/reports', permission: 'reports' });
    }
    
    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Cornven POS</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{user.name}</span>
              <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                {getRoleDisplayName(user.role)}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;