import React from 'react';
import { Building, MapPin, DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Tenant, Payment, Expense, PettyCashTransaction, Issue, ProductUsage, Product } from '../../types';

interface EntranceFinancialSummaryProps {
  building: Building;
  tenants: Tenant[];
  payments: Payment[];
  expenses: Expense[];
  pettyCash: PettyCashTransaction[];
  issues: Issue[];
  productUsages: ProductUsage[];
  products: Product[];
  monthlyAmount: number;
}

export const EntranceFinancialSummary: React.FC<EntranceFinancialSummaryProps> = ({
  building,
  tenants,
  payments,
  expenses,
  pettyCash,
  issues,
  productUsages,
  products,
  monthlyAmount
}) => {
  const currentYear = 2024;

  // Calculate data for each entrance
  const entranceData = building.entrances.map(entrance => {
    // Tenants in this entrance
    const entranceTenants = tenants.filter(t => t.entrance === entrance);
    
    // Income from tenants
    const entranceIncome = entranceTenants.reduce((sum, tenant) => {
      const tenantPayments = payments.filter(p => 
        p.tenantId === tenant.id && p.year === currentYear && p.paid
      );
      return sum + (tenantPayments.length * monthlyAmount);
    }, 0);

    // Expenses for this entrance
    const entranceExpenses = expenses
      .filter(e => e.entrance === entrance)
      .reduce((sum, e) => sum + e.amount, 0);

    // Petty cash for this entrance
    const entrancePettyCashIncome = pettyCash
      .filter(p => p.entrance === entrance && p.type === 'income')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const entrancePettyCashExpenses = pettyCash
      .filter(p => p.entrance === entrance && p.type === 'expense')
      .reduce((sum, p) => sum + p.amount, 0);

    // Issues for this entrance
    const entranceIssues = issues.filter(i => i.entrance === entrance);
    const entranceRepairCosts = entranceIssues
      .filter(i => i.status === 'resolved' && i.repairCost)
      .reduce((sum, i) => sum + (i.repairCost || 0), 0);

    // Inventory usage for this entrance
    const entranceInventoryCost = productUsages
      .filter(u => u.location.includes(`כניסה ${entrance}`))
      .reduce((sum, u) => sum + u.cost, 0);

    // Calculate totals
    const totalIncome = entranceIncome + entrancePettyCashIncome;
    const totalExpenses = entranceExpenses + entrancePettyCashExpenses + entranceRepairCosts + entranceInventoryCost;
    const netProfit = totalIncome - totalExpenses;

    return {
      entrance,
      tenantCount: entranceTenants.length,
      income: entranceIncome,
      pettyCashIncome: entrancePettyCashIncome,
      expenses: entranceExpenses,
      pettyCashExpenses: entrancePettyCashExpenses,
      repairCosts: entranceRepairCosts,
      inventoryCost: entranceInventoryCost,
      totalIncome,
      totalExpenses,
      netProfit,
      openIssues: entranceIssues.filter(i => i.status !== 'resolved').length,
      debtorCount: entranceTenants.filter(t => t.isDebtor).length
    };
  });

  // Calculate building-wide totals (items not assigned to specific entrance)
  const buildingWideExpenses = expenses
    .filter(e => !e.entrance)
    .reduce((sum, e) => sum + e.amount, 0);

  const buildingWidePettyCashIncome = pettyCash
    .filter(p => !p.entrance && p.type === 'income')
    .reduce((sum, p) => sum + p.amount, 0);

  const buildingWidePettyCashExpenses = pettyCash
    .filter(p => !p.entrance && p.type === 'expense')
    .reduce((sum, p) => sum + p.amount, 0);

  const buildingWideIssues = issues.filter(i => !i.entrance);
  const buildingWideRepairCosts = buildingWideIssues
    .filter(i => i.status === 'resolved' && i.repairCost)
    .reduce((sum, i) => sum + (i.repairCost || 0), 0);

  const buildingWideInventoryCost = productUsages
    .filter(u => !u.location.includes('כניסה'))
    .reduce((sum, u) => sum + u.cost, 0);

  const buildingWideTotalExpenses = buildingWideExpenses + buildingWidePettyCashExpenses + buildingWideRepairCosts + buildingWideInventoryCost;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <MapPin className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">ניתוח פיננסי לפי כניסות</h3>
      </div>

      {/* Entrance-specific data */}
      <div className="grid gap-6">
        {entranceData.map((data) => (
          <div key={data.entrance} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                כניסה {data.entrance}
              </h4>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{data.tenantCount} דיירים</span>
                {data.debtorCount > 0 && (
                  <span className="text-red-600">{data.debtorCount} חייבים</span>
                )}
                {data.openIssues > 0 && (
                  <span className="text-orange-600">{data.openIssues} תקלות פתוחות</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Income */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">הכנסות</span>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-green-900">
                    {data.totalIncome.toLocaleString()}₪
                  </div>
                  <div className="text-xs text-green-700">
                    <div>דמי בית: {data.income.toLocaleString()}₪</div>
                    {data.pettyCashIncome > 0 && (
                      <div>קופה קטנה: {data.pettyCashIncome.toLocaleString()}₪</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expenses */}
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">הוצאות</span>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-red-900">
                    {data.totalExpenses.toLocaleString()}₪
                  </div>
                  <div className="text-xs text-red-700">
                    {data.expenses > 0 && <div>הוצאות: {data.expenses.toLocaleString()}₪</div>}
                    {data.pettyCashExpenses > 0 && <div>קופה קטנה: {data.pettyCashExpenses.toLocaleString()}₪</div>}
                    {data.repairCosts > 0 && <div>תיקונים: {data.repairCosts.toLocaleString()}₪</div>}
                    {data.inventoryCost > 0 && <div>מלאי: {data.inventoryCost.toLocaleString()}₪</div>}
                  </div>
                </div>
              </div>

              {/* Net Profit */}
              <div className={`rounded-lg p-4 ${data.netProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className={`h-4 w-4 ${data.netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                  <span className={`text-sm font-medium ${data.netProfit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                    רווח נקי
                  </span>
                </div>
                <div className={`text-lg font-bold ${data.netProfit >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                  {data.netProfit.toLocaleString()}₪
                </div>
              </div>

              {/* Profitability Ratio */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-800">רווחיות</span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {data.totalIncome > 0 ? ((data.netProfit / data.totalIncome) * 100).toFixed(1) : '0'}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Building-wide expenses */}
      {buildingWideTotalExpenses > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building className="h-5 w-5 text-gray-600" />
            <h4 className="text-lg font-semibold text-gray-900">הוצאות כלליות לכל הבניין</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {buildingWideExpenses > 0 && (
              <div className="bg-white rounded-lg p-4 border">
                <div className="text-sm text-gray-600 mb-1">הוצאות כלליות</div>
                <div className="text-lg font-bold text-gray-900">
                  {buildingWideExpenses.toLocaleString()}₪
                </div>
              </div>
            )}
            
            {buildingWidePettyCashExpenses > 0 && (
              <div className="bg-white rounded-lg p-4 border">
                <div className="text-sm text-gray-600 mb-1">קופה קטנה</div>
                <div className="text-lg font-bold text-gray-900">
                  {buildingWidePettyCashExpenses.toLocaleString()}₪
                </div>
              </div>
            )}
            
            {buildingWideRepairCosts > 0 && (
              <div className="bg-white rounded-lg p-4 border">
                <div className="text-sm text-gray-600 mb-1">תיקונים כלליים</div>
                <div className="text-lg font-bold text-gray-900">
                  {buildingWideRepairCosts.toLocaleString()}₪
                </div>
              </div>
            )}
            
            {buildingWideInventoryCost > 0 && (
              <div className="bg-white rounded-lg p-4 border">
                <div className="text-sm text-gray-600 mb-1">מלאי כללי</div>
                <div className="text-lg font-bold text-gray-900">
                  {buildingWideInventoryCost.toLocaleString()}₪
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                הוצאות אלו משותפות לכל הכניסות ויש לחלקן בהתאם לצורך
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};