import React from 'react';
import { DollarSign, PiggyBank, Users, AlertTriangle } from 'lucide-react';

interface StatsGridProps {
  annualBalance: number;
  pettyCashBalance: number;
  debtorCount: number;
  openIssues: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  annualBalance,
  pettyCashBalance,
  debtorCount,
  openIssues
}) => {
  const stats = [
    {
      title: 'יתרה שנתית ראשית',
      value: `${annualBalance.toLocaleString()}₪`,
      icon: DollarSign,
      color: annualBalance >= 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
    },
    {
      title: 'קופה קטנה',
      value: `${pettyCashBalance.toLocaleString()}₪`,
      icon: PiggyBank,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'דיירים חייבים',
      value: debtorCount.toString(),
      icon: Users,
      color: debtorCount > 0 ? 'text-orange-600 bg-orange-100' : 'text-green-600 bg-green-100'
    },
    {
      title: 'תקלות פתוחות',
      value: openIssues.toString(),
      icon: AlertTriangle,
      color: openIssues > 0 ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};