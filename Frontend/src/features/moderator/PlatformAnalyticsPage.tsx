import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent 
} from '../../components/ui/chart';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Building2,
  Activity,
  Target
} from 'lucide-react';

// Sample data for charts
const monthlyData = [
  { month: 'Jan', users: 120, sales: 4500, orders: 89, parts: 156 },
  { month: 'Feb', users: 180, sales: 5200, orders: 102, parts: 189 },
  { month: 'Mar', users: 220, sales: 6100, orders: 134, parts: 234 },
  { month: 'Apr', users: 280, sales: 7200, orders: 167, parts: 289 },
  { month: 'May', users: 320, sales: 8500, orders: 201, parts: 345 },
  { month: 'Jun', users: 380, sales: 9200, orders: 245, parts: 412 },
  { month: 'Jul', users: 420, sales: 10800, orders: 289, parts: 478 },
  { month: 'Aug', users: 480, sales: 12500, orders: 334, parts: 556 },
  { month: 'Sep', users: 520, sales: 13800, orders: 378, parts: 623 },
  { month: 'Oct', users: 580, sales: 15200, orders: 423, parts: 689 },
  { month: 'Nov', users: 640, sales: 16800, orders: 467, parts: 756 },
  { month: 'Dec', users: 720, sales: 18500, orders: 512, parts: 823 },
];

const userTypeData = [
  { name: 'Buyers', value: 65, color: '#3b82f6' },
  { name: 'Partners', value: 25, color: '#10b981' },
  { name: 'Moderators', value: 10, color: '#f59e0b' },
];

const categoryData = [
  { name: 'Engine Parts', value: 35, color: '#ef4444' },
  { name: 'Brake System', value: 25, color: '#8b5cf6' },
  { name: 'Electrical', value: 20, color: '#06b6d4' },
  { name: 'Suspension', value: 15, color: '#84cc16' },
  { name: 'Others', value: 5, color: '#f97316' },
];

const weeklyData = [
  { day: 'Mon', orders: 45, revenue: 3200 },
  { day: 'Tue', orders: 52, revenue: 3800 },
  { day: 'Wed', orders: 48, revenue: 3500 },
  { day: 'Thu', orders: 61, revenue: 4200 },
  { day: 'Fri', orders: 55, revenue: 3900 },
  { day: 'Sat', orders: 67, revenue: 4800 },
  { day: 'Sun', orders: 58, revenue: 4100 },
];

const chartConfig = {
  users: {
    label: "Users",
    color: "#3b82f6",
    theme: {
      light: "#3b82f6",
      dark: "#60a5fa",
    },
  },
  sales: {
    label: "Sales (DH)",
    color: "#10b981",
    theme: {
      light: "#10b981",
      dark: "#34d399",
    },
  },
  orders: {
    label: "Orders",
    color: "#f59e0b",
    theme: {
      light: "#f59e0b",
      dark: "#fbbf24",
    },
  },
  parts: {
    label: "Parts",
    color: "#8b5cf6",
    theme: {
      light: "#8b5cf6",
      dark: "#a78bfa",
    },
  },
  revenue: {
    label: "Revenue (DH)",
    color: "#ef4444",
    theme: {
      light: "#ef4444",
      dark: "#f87171",
    },
  },
};

const PlatformAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-black text-black dark:text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Platform Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor platform performance, user activity, and business metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'users'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'sales'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Sales
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">720</div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18,500 DH</div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">512</div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  +15% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Parts</CardTitle>
                <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">823</div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  +22% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends Chart */}
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Monthly Platform Growth</CardTitle>
              <CardDescription>
                Track user growth, sales, orders, and parts over the last 12 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-[400px]">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(var(--color-users))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--color-users))", strokeWidth: 2, r: 5, stroke: "hsl(var(--background))" }}
                    activeDot={{ r: 7, stroke: "hsl(var(--color-users))", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--color-sales))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--color-sales))", strokeWidth: 2, r: 5, stroke: "hsl(var(--background))" }}
                    activeDot={{ r: 7, stroke: "hsl(var(--color-sales))", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--color-orders))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--color-orders))", strokeWidth: 2, r: 5, stroke: "hsl(var(--background))" }}
                    activeDot={{ r: 7, stroke: "hsl(var(--color-orders))", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="parts"
                    stroke="hsl(var(--color-parts))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--color-parts))", strokeWidth: 2, r: 5, stroke: "hsl(var(--background))" }}
                    activeDot={{ r: 7, stroke: "hsl(var(--color-parts))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* User Distribution and Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown of platform users by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-[300px]">
                  <PieChart>
                    <Pie
                      data={userTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    >
                      {userTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Parts by Category</CardTitle>
                <CardDescription>Distribution of auto parts by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-[300px]">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>User Growth Trends</CardTitle>
              <CardDescription>Monthly user registration and activity patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-[400px]">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    fill="hsl(var(--color-users))"
                    fillOpacity={0.4}
                    stroke="hsl(var(--color-users))"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="space-y-6">
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Weekly Sales Performance</CardTitle>
              <CardDescription>Daily orders and revenue for the current week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-[400px]">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="orders"
                    fill="hsl(var(--color-orders))"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--color-revenue))"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue growth and projections</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-[400px]">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--color-sales))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--color-sales))", strokeWidth: 2, r: 6, stroke: "hsl(var(--background))" }}
                    activeDot={{ r: 8, stroke: "hsl(var(--color-sales))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PlatformAnalyticsPage;
