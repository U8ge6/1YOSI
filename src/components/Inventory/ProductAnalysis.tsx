import React from 'react';
import { TrendingUp, Package, DollarSign, Eye } from 'lucide-react';
import { Product, ProductUsage, ProductHistory } from '../../types';

interface ProductAnalysisProps {
  products: Product[];
  productUsages: ProductUsage[];
  productHistory: ProductHistory[];
}

export const ProductAnalysis: React.FC<ProductAnalysisProps> = ({
  products,
  productUsages,
  productHistory
}) => {
  const getProductUsageData = (productId: string) => {
    const usages = productUsages.filter(u => u.productId === productId);
    const totalUsed = usages.reduce((sum, u) => sum + u.quantity, 0);
    const totalCost = usages.reduce((sum, u) => sum + u.cost, 0);
    const usageCount = usages.length;
    
    return { totalUsed, totalCost, usageCount };
  };

  const handleViewHistory = (productId: string) => {
    // This would open a detailed history modal
    console.log('View history for product:', productId);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <TrendingUp className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">ניתוח מוצרים</h3>
      </div>

      <div className="grid gap-6">
        {products.map((product) => {
          const usageData = getProductUsageData(product.id);
          
          return (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  {product.name}
                </h4>
                <button
                  onClick={() => handleViewHistory(product.id)}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  היסטוריה מפורטת
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">מלאי נוכחי</span>
                  </div>
                  <div className="text-lg font-bold text-blue-900">
                    {product.quantity} יחידות
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">סך נוצל</span>
                  </div>
                  <div className="text-lg font-bold text-red-900">
                    {usageData.totalUsed} יחידות
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">עלות שימוש</span>
                  </div>
                  <div className="text-lg font-bold text-green-900">
                    {usageData.totalCost.toLocaleString()}₪
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">מספר שימושים</span>
                  </div>
                  <div className="text-lg font-bold text-orange-900">
                    {usageData.usageCount}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>מחיר ליחידה: {product.pricePerUnit}₪</span>
                  <span>ערך מלאי נוכחי: {(product.quantity * product.pricePerUnit).toLocaleString()}₪</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {products.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">אין מוצרים רשומים במערכת</p>
        </div>
      )}
    </div>
  );
};