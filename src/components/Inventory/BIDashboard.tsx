import React from 'react';
import { Activity, Package, DollarSign, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Product, ProductUsage, ProductHistory } from '../../types';

interface BIDashboardProps {
  products: Product[];
  productUsages: ProductUsage[];
  productHistory: ProductHistory[];
}

const COLORS = ['#2563EB', '#0D9488', '#EA580C', '#DC2626', '#059669', '#D97706', '#7C3AED', '#EC4899'];

export const BIDashboard: React.FC<BIDashboardProps> = ({
  products,
  productUsages,
  productHistory
}) => {
  // Calculate stats
  const totalProducts = products.length;
  const totalInventoryUnits = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.quantity * p.pricePerUnit), 0);
  const totalUsageCost = productUsages.reduce((sum, u) => sum + u.cost, 0);

  // Prepare cost distribution data
  const costByProduct = productUsages.reduce((acc, usage) => {
    const product = products.find(p => p.id === usage.productId);
    const productName = product?.name || 'לא ידוע';
    
    if (!acc[productName]) {
      acc[productName] = 0;
    }
    acc[productName] += usage.cost;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(costByProduct).map(([name, cost]) => ({
    name,
    value: cost,
    percentage: ((cost / totalUsageCost) * 100).toFixed(1)
  }));

  // Prepare location cost data
  const costByLocation = productUsages.reduce((acc, usage) => {
    if (!acc[usage.location]) {
      acc[usage.location] = 0;
    }
    acc[usage.location] += usage.cost;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(costByLocation)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([location, cost]) => ({
      location: location.length > 15 ? location.substring(0, 15) + '...' : location,
      cost
    }));

  // Prepare timeline data (daily usage costs)
  const dailyCosts = productUsages.reduce((acc, usage) => {
    const date = usage.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += usage.cost;
    return acc;
  }, {} as Record<string, number>);

  const lineData = Object.entries(dailyCosts)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .slice(-30) // Last 30 days
    .map(([date, cost]) => ({
      date: new Date(date).toLocaleDateString('he-IL'),
      cost
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">{payload[0].value.toLocaleString()}₪</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-blue-600">{data.value.toLocaleString()}₪</p>
          <p className="text-gray-600">{data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Activity className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">לוח מחוונים - ניתוח נתונים</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">סך המוצרים</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">סך יחידות במלאי</p>
              <p className="text-2xl font-bold text-gray-900">{totalInventoryUnits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-full">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">ערך מלאי כולל</p>
              <p className="text-2xl font-bold text-gray-900">{totalInventoryValue.toLocaleString()}₪</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-full">
              <Activity className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">סך עלויות שימוש</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsageCost.toLocaleString()}₪</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">התפלגות עלויות לפי מוצר</h4>
          {pieData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              אין נתונים להצגה
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">עלויות לפי מיקום</h4>
          {barData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="cost" fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              אין נתונים להצגה
            </div>
          )}
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">מגמות שימוש לאורך זמן</h4>
        {lineData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="cost" stroke="#2563EB" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            אין נתונים להצגה
          </div>
        )}
      </div>
    </div>
  );
};