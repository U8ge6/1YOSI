import React, { useState } from 'react';
import { Package, BarChart3, History, MapPin, TrendingUp, Activity } from 'lucide-react';
import { ProductUsage } from './ProductUsage';
import { ProductManagement } from './ProductManagement';
import { ActionHistory } from './ActionHistory';
import { LocationAnalysis } from './LocationAnalysis';
import { ProductAnalysis } from './ProductAnalysis';
import { BIDashboard } from './BIDashboard';
import { ProductHistoryEditModal } from './ProductHistoryEditModal';
import { Product, ProductUsage as ProductUsageType, ProductHistory, Building } from '../../types';

interface InventoryProps {
  products: Product[];
  productUsages: ProductUsageType[];
  productHistory: ProductHistory[];
  currentLocation: string;
  building: Building;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUseProduct: (usage: Omit<ProductUsageType, 'id'>) => void;
  onAddStock: (productId: string, quantity: number, notes?: string) => void;
  onUpdateProductHistory: (history: ProductHistory) => void;
  onDeleteProductHistory: (historyId: string) => void;
}

const SUB_TABS = [
  { id: 'usage', label: 'שימוש במוצרים', icon: Package },
  { id: 'management', label: 'ניהול מוצרים', icon: BarChart3 },
  { id: 'history', label: 'היסטוריית פעולות', icon: History },
  { id: 'location-analysis', label: 'ניתוח מיקומים', icon: MapPin },
  { id: 'product-analysis', label: 'ניתוח מוצרים', icon: TrendingUp },
  { id: 'bi-dashboard', label: 'ניתוח נתונים', icon: Activity }
];

export const Inventory: React.FC<InventoryProps> = ({
  products,
  productUsages,
  productHistory,
  currentLocation,
  building,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUseProduct,
  onAddStock,
  onUpdateProductHistory,
  onDeleteProductHistory
}) => {
  const [activeSubTab, setActiveSubTab] = useState('usage');
  const [editingHistory, setEditingHistory] = useState<ProductHistory | null>(null);

  const handleEditHistory = (history: ProductHistory) => {
    setEditingHistory(history);
  };

  const handleUpdateHistory = (updatedHistory: ProductHistory) => {
    onUpdateProductHistory(updatedHistory);
    setEditingHistory(null);
  };

  const renderContent = () => {
    switch (activeSubTab) {
      case 'usage':
        return (
          <ProductUsage
            products={products}
            currentLocation={currentLocation}
            building={building}
            onUseProduct={onUseProduct}
          />
        );
      case 'management':
        return (
          <ProductManagement
            products={products}
            productHistory={productHistory}
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
            onAddStock={onAddStock}
          />
        );
      case 'history':
        return (
          <ActionHistory
            productHistory={productHistory}
            products={products}
            onEditHistory={handleEditHistory}
            onDeleteHistory={onDeleteProductHistory}
          />
        );
      case 'location-analysis':
        return (
          <LocationAnalysis
            productUsages={productUsages}
            products={products}
          />
        );
      case 'product-analysis':
        return (
          <ProductAnalysis
            products={products}
            productUsages={productUsages}
            productHistory={productHistory}
          />
        );
      case 'bi-dashboard':
        return (
          <BIDashboard
            products={products}
            productUsages={productUsages}
            productHistory={productHistory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ניהול מלאי</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {SUB_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeSubTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {editingHistory && (
        <ProductHistoryEditModal
          history={editingHistory}
          products={products}
          onSave={handleUpdateHistory}
          onClose={() => setEditingHistory(null)}
        />
      )}
    </div>
  );
};