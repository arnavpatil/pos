'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, TrendingUp, TrendingDown, DollarSign, Users, Package, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';

interface SalesReport {
  period: string;
  totalSales: number;
  totalTransactions: number;
  averageTransaction: number;
  growth: number;
  topProducts: Array<{
    name: string;
    sales: number;
    quantity: number;
  }>;
  topTenants: Array<{
    name: string;
    sales: number;
    commission: number;
  }>;
}

interface InventoryReport {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockItems: number;
  totalValue: number;
  categories: Array<{
    name: string;
    count: number;
    value: number;
  }>;
}

interface TenantReport {
  totalTenants: number;
  activeTenants: number;
  newTenants: number;
  churnRate: number;
  averageRent: number;
  totalRentCollected: number;
  overduePayments: number;
  tenantPerformance: Array<{
    name: string;
    cubeNumber: string;
    sales: number;
    rentStatus: 'current' | 'overdue';
    joinDate: string;
  }>;
}

interface FinancialReport {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  revenueBySource: {
    sales: number;
    rent: number;
    commissions: number;
  };
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
}

const ReportsAnalytics = () => {
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [inventoryReport, setInventoryReport] = useState<InventoryReport | null>(null);
  const [tenantReport, setTenantReport] = useState<TenantReport | null>(null);
  const [financialReport, setFinancialReport] = useState<FinancialReport | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockSalesReport: SalesReport = {
        period: selectedPeriod,
        totalSales: 25420.75,
        totalTransactions: 156,
        averageTransaction: 163.08,
        growth: 12.5,
        topProducts: [
          { name: 'Abstract Canvas Painting', sales: 3599.88, quantity: 12 },
          { name: 'Silver Jewelry Set', sales: 2399.85, quantity: 15 },
          { name: 'Handmade Ceramic Vase', sales: 1799.84, quantity: 20 },
          { name: 'Wooden Sculpture', sales: 1350.00, quantity: 3 },
          { name: 'Handwoven Scarf', sales: 975.00, quantity: 15 },
        ],
        topTenants: [
          { name: 'Sarah Johnson', sales: 8950.88, commission: 1342.63 },
          { name: 'Emma Wilson', sales: 7420.50, commission: 1335.69 },
          { name: 'Mike Chen', sales: 5890.25, commission: 706.83 },
        ],
      };

      const mockInventoryReport: InventoryReport = {
        totalProducts: 1250,
        lowStockItems: 23,
        outOfStockItems: 8,
        overstockItems: 15,
        totalValue: 125420.50,
        categories: [
          { name: 'Paintings', count: 350, value: 45200.00 },
          { name: 'Ceramics', count: 280, value: 28500.00 },
          { name: 'Jewelry', count: 220, value: 35800.00 },
          { name: 'Sculptures', count: 180, value: 12600.00 },
          { name: 'Textiles', count: 220, value: 3320.50 },
        ],
      };

      const mockTenantReport: TenantReport = {
        totalTenants: 45,
        activeTenants: 38,
        newTenants: 5,
        churnRate: 8.5,
        averageRent: 425.50,
        totalRentCollected: 16169.00,
        overduePayments: 3,
        tenantPerformance: [
          { name: 'Sarah Johnson', cubeNumber: 'A12', sales: 8950.88, rentStatus: 'current', joinDate: '2023-08-15' },
          { name: 'Emma Wilson', cubeNumber: 'C08', sales: 7420.50, rentStatus: 'current', joinDate: '2023-09-10' },
          { name: 'Mike Chen', cubeNumber: 'B05', sales: 5890.25, rentStatus: 'overdue', joinDate: '2023-06-20' },
        ],
      };

      const mockFinancialReport: FinancialReport = {
        totalRevenue: 41589.75,
        totalExpenses: 18250.30,
        netProfit: 23339.45,
        profitMargin: 56.1,
        revenueBySource: {
          sales: 25420.75,
          rent: 16169.00,
          commissions: 0, // This would be negative as it's paid out
        },
        monthlyTrend: [
          { month: 'Jan', revenue: 38500, expenses: 16200, profit: 22300 },
          { month: 'Feb', revenue: 42100, expenses: 17800, profit: 24300 },
          { month: 'Mar', revenue: 41589, expenses: 18250, profit: 23339 },
        ],
      };

      setSalesReport(mockSalesReport);
      setInventoryReport(mockInventoryReport);
      setTenantReport(mockTenantReport);
      setFinancialReport(mockFinancialReport);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = (reportType: string) => {
    // This would generate and download the report
    alert(`Exporting ${reportType} report...`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="this_quarter">This Quarter</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          {selectedPeriod === 'custom' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, 'LLL dd')} - ${format(dateRange.to, 'LLL dd')}`
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    'Pick a date range'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(financialReport?.totalRevenue || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{formatPercentage(12.5)}</span> from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(salesReport?.totalSales || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {salesReport?.totalTransactions} transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tenantReport?.activeTenants}</div>
                <p className="text-xs text-muted-foreground">
                  {tenantReport?.newTenants} new this period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(inventoryReport?.totalValue || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {inventoryReport?.totalProducts} products
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Tenants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesReport?.topTenants.map((tenant, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-sm text-gray-500">Commission: {formatCurrency(tenant.commission)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(tenant.sales)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesReport?.topProducts.slice(0, 5).map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.quantity} sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(product.sales)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Sales Report</h3>
              <Button onClick={() => exportReport('sales')}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(salesReport?.totalSales || 0)}</div>
                  <div className="flex items-center mt-2">
                    {salesReport && salesReport.growth > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={salesReport && salesReport.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatPercentage(salesReport?.growth || 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{salesReport?.totalTransactions}</div>
                  <p className="text-sm text-gray-500 mt-2">
                    Avg: {formatCurrency(salesReport?.averageTransaction || 0)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPercentage(salesReport?.growth || 0)}</div>
                  <p className="text-sm text-gray-500 mt-2">vs previous period</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesReport?.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.quantity} units sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(product.sales)}</p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(product.sales / product.quantity)} avg
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Inventory Report</h3>
              <Button onClick={() => exportReport('inventory')}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inventoryReport?.totalProducts}</div>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatCurrency(inventoryReport?.totalValue || 0)} value
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{inventoryReport?.lowStockItems}</div>
                  <p className="text-sm text-gray-500 mt-2">Need restocking</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{inventoryReport?.outOfStockItems}</div>
                  <p className="text-sm text-gray-500 mt-2">Immediate attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Overstock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{inventoryReport?.overstockItems}</div>
                  <p className="text-sm text-gray-500 mt-2">Consider promotion</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Inventory by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryReport?.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-gray-500">{category.count} products</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(category.value)}</p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(category.value / category.count)} avg
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tenants">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Tenant Report</h3>
              <Button onClick={() => exportReport('tenants')}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tenantReport?.totalTenants}</div>
                  <p className="text-sm text-gray-500 mt-2">
                    {tenantReport?.activeTenants} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">New Tenants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{tenantReport?.newTenants}</div>
                  <p className="text-sm text-gray-500 mt-2">This period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{tenantReport?.churnRate}%</div>
                  <p className="text-sm text-gray-500 mt-2">Tenant turnover</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{tenantReport?.overduePayments}</div>
                  <p className="text-sm text-gray-500 mt-2">Need follow-up</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tenant Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tenantReport?.tenantPerformance.map((tenant, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-sm text-gray-500">
                          Cube {tenant.cubeNumber} • Joined {new Date(tenant.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(tenant.sales)}</p>
                          <p className="text-sm text-gray-500">Sales</p>
                        </div>
                        <Badge 
                          className={tenant.rentStatus === 'current' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {tenant.rentStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Financial Report</h3>
              <Button onClick={() => exportReport('financial')}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(financialReport?.totalRevenue || 0)}</div>
                  <p className="text-sm text-gray-500 mt-2">All sources</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(financialReport?.totalExpenses || 0)}</div>
                  <p className="text-sm text-gray-500 mt-2">Operating costs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(financialReport?.netProfit || 0)}</div>
                  <p className="text-sm text-gray-500 mt-2">
                    {financialReport?.profitMargin.toFixed(1)}% margin
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{financialReport?.profitMargin.toFixed(1)}%</div>
                  <p className="text-sm text-gray-500 mt-2">Revenue efficiency</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Product Sales</span>
                      <span className="font-bold">{formatCurrency(financialReport?.revenueBySource.sales || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Rent Collection</span>
                      <span className="font-bold">{formatCurrency(financialReport?.revenueBySource.rent || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="font-medium">Total Revenue</span>
                      <span className="font-bold">{formatCurrency(financialReport?.totalRevenue || 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {financialReport?.monthlyTrend.map((month, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-medium">{month.month}</span>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(month.profit)}</p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(month.revenue)} revenue
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAnalytics;