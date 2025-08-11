'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalTenants: number;
  activeTenants: number;
  totalProducts: number;
  lowStockItems: number;
  todaySales: number;
  pendingDisputes: number;
  upcomingReservations: number;
  totalRevenue: number;
}

interface RecentActivity {
  id: string;
  type: 'tenant' | 'sale' | 'dispute' | 'reservation';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

const AgentDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTenants: 0,
    activeTenants: 0,
    totalProducts: 0,
    lowStockItems: 0,
    todaySales: 0,
    pendingDisputes: 0,
    upcomingReservations: 0,
    totalRevenue: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Mock data - replace with actual API calls
        setStats({
          totalTenants: 45,
          activeTenants: 38,
          totalProducts: 1250,
          lowStockItems: 23,
          todaySales: 87,
          pendingDisputes: 5,
          upcomingReservations: 12,
          totalRevenue: 15420.50,
        });

        setRecentActivity([
          {
            id: '1',
            type: 'tenant',
            description: 'New tenant "Art Studio 23" registered',
            timestamp: '2 hours ago',
            status: 'success',
          },
          {
            id: '2',
            type: 'sale',
            description: 'Sale completed: $245.00 - Cube A12',
            timestamp: '3 hours ago',
            status: 'success',
          },
          {
            id: '3',
            type: 'dispute',
            description: 'Damage report filed for Cube B05',
            timestamp: '5 hours ago',
            status: 'warning',
          },
          {
            id: '4',
            type: 'reservation',
            description: 'Pickup scheduled for tomorrow - Cube C08',
            timestamp: '1 day ago',
            status: 'info',
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'tenant':
        return '👥';
      case 'sale':
        return '💳';
      case 'dispute':
        return '⚠️';
      case 'reservation':
        return '📅';
      default:
        return '📋';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeTenants} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <span className="text-2xl">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lowStockItems} low stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <span className="text-2xl">💳</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaySales}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
            <span className="text-2xl">⚠️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDisputes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.upcomingReservations} reservations
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl">➕</span>
                <span className="text-sm">Add Tenant</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <span className="text-2xl">📦</span>
                <span className="text-sm">Add Product</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <span className="text-2xl">💳</span>
                <span className="text-sm">New Sale</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <span className="text-2xl">📊</span>
                <span className="text-sm">View Reports</span>
              </Button>
            </div>
            
            <div className="mt-6 space-y-3">
              <Button variant="secondary" className="w-full justify-start">
                <span className="mr-2">🔔</span>
                Send Notification to All Tenants
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <span className="mr-2">📋</span>
                Generate Daily Report
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <span className="mr-2">🏢</span>
                Manage Cube Assignments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentDashboard;