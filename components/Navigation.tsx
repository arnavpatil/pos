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

  const navItems = [
    { name: 'Tenants', href: '/admin/tenants', permission: 'tenants' },
    { name: 'Inventory', href: '/inventory', permission: 'inventory' },
    { name: 'POS', href: '/pos', permission: 'pos' },
    { name: 'Reports', href: '/reports', permission: 'reports' },
  ];

  const accessibleItems = navItems.filter(item => userPermissions.includes(item.permission));

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Cornven POS</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {accessibleItems.map((item) => (
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
              {navItems.filter(item => !userPermissions.includes(item.permission)).map((item) => (
                <span
                  key={item.name}
                  className="border-transparent text-gray-400 cursor-not-allowed inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium relative"
                >
                  {item.name}
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    No Access
                  </span>
                </span>
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