import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface FinancialSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  totalIncome,
  totalExpenses,
  balance
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-green-600" />
        סיכום כספי תקופתי
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">סך הכנסות</span>
          </div>
          <span className="text-lg font-bold text-green-900">
            {totalIncome.toLocaleString()}₪
          </span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-800">סך הוצאות</span>
          </div>
          <span className="text-lg font-bold text-red-900">
            {totalExpenses.toLocaleString()}₪
          </span>
        </div>
        
        <div className={`flex items-center justify-between p-4 rounded-lg ${
          balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'
        }`}>
          <div className="flex items-center gap-2">
            <DollarSign className={`h-5 w-5 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            <span className={`font-medium ${balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
              מאזן
            </span>
          </div>
          <span className={`text-lg font-bold ${balance >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
            {balance.toLocaleString()}₪
          </span>
        </div>
      </div>
    </div>
  );
};