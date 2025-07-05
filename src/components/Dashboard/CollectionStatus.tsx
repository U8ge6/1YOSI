import React from 'react';
import { Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Tenant, Payment } from '../../types';

interface CollectionStatusProps {
  tenants: Tenant[];
  payments: Payment[];
  currentYear: number;
}

export const CollectionStatus: React.FC<CollectionStatusProps> = ({
  tenants,
  payments,
  currentYear
}) => {
  const paidCount = tenants.filter(t => !t.isDebtor).length;
  const debtorCount = tenants.filter(t => t.isDebtor).length;
  const totalTenants = tenants.length;
  const collectionRate = totalTenants > 0 ? (paidCount / totalTenants) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-600" />
        סיכום סטטוס גבייה שנתי
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-gray-700">דיירים ששילמו</span>
          </div>
          <span className="font-bold text-green-800">{paidCount}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-gray-700">דיירים חייבים</span>
          </div>
          <span className="font-bold text-red-800">{debtorCount}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-700">סך הכל דיירים</span>
          <span className="font-bold text-gray-900">{totalTenants}</span>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">אחוז גבייה</span>
            <span className="text-sm font-medium text-gray-900">{collectionRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${collectionRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};