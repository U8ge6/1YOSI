import React from 'react';
import { 
  Home, 
  Users, 
  CreditCard, 
  Receipt, 
  PiggyBank, 
  UserCheck, 
  AlertTriangle, 
  Package,
  Settings
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabOrder: string[];
}

const tabIcons = {
  dashboard: Home,
  tenants: Users,
  payments: CreditCard,
  expenses: Receipt,
  'petty-cash': PiggyBank,
  employees: UserCheck,
  issues: AlertTriangle,
  inventory: Package,
  settings: Settings
};

const tabLabels = {
  dashboard: 'לוח בקרה',
  tenants: 'דיירים',
  payments: 'גבייה',
  expenses: 'הוצאות כלליות',
  'petty-cash': 'קופה קטנה',
  employees: 'ניהול עובדים',
  issues: 'תקלות',
  inventory: 'ניהול מלאי',
  settings: 'הגדרות'
};

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  tabOrder
}) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabOrder.map((tab) => {
            const Icon = tabIcons[tab as keyof typeof tabIcons];
            const label = tabLabels[tab as keyof typeof tabLabels];
            
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};