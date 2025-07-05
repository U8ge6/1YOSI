import React from 'react';
import { StatsGrid } from './StatsGrid';
import { BuildingInfo } from './BuildingInfo';
import { FinancialSummary } from './FinancialSummary';
import { CollectionStatus } from './CollectionStatus';
import { ExpenseDistribution } from './ExpenseDistribution';
import { EntranceFinancialSummary } from './EntranceFinancialSummary';
import { AppState } from '../../types';

interface DashboardProps {
  data: AppState;
  onUpdateBuilding: (building: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onUpdateBuilding }) => {
  const currentBuilding = data.buildings.find(b => b.id === data.currentBuildingId)!;
  const tenants = data.tenants[data.currentBuildingId] || [];
  const payments = data.payments[data.currentBuildingId] || [];
  const expenses = data.expenses[data.currentBuildingId] || [];
  const pettyCash = data.pettyCash[data.currentBuildingId] || [];
  const issues = data.issues[data.currentBuildingId] || [];

  // Calculate stats
  const totalIncome = payments.filter(p => p.paid).length * (data.settings.monthlyAmount[data.currentBuildingId] || 450);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const annualBalance = totalIncome - totalExpenses;
  
  const pettyCashBalance = pettyCash.reduce((sum, t) => 
    sum + (t.type === 'income' ? t.amount : -t.amount), 0
  );
  
  const debtorCount = tenants.filter(t => t.isDebtor).length;
  const openIssues = issues.filter(i => i.status !== 'resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <StatsGrid
        annualBalance={annualBalance}
        pettyCashBalance={pettyCashBalance}
        debtorCount={debtorCount}
        openIssues={openIssues}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BuildingInfo building={currentBuilding} onUpdateBuilding={onUpdateBuilding} />
        <FinancialSummary 
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={annualBalance}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CollectionStatus 
          tenants={tenants}
          payments={payments}
          currentYear={2024}
        />
        <ExpenseDistribution expenses={expenses} />
      </div>

      {/* Entrance-level financial analysis */}
      <EntranceFinancialSummary
        building={currentBuilding}
        tenants={tenants}
        payments={payments}
        expenses={expenses}
        pettyCash={pettyCash}
        issues={issues}
        productUsages={data.productUsages}
        products={data.products}
        monthlyAmount={data.settings.monthlyAmount[data.currentBuildingId] || 450}
      />
    </div>
  );
};