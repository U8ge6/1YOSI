import React from 'react';
import { MapPin, Package, DollarSign } from 'lucide-react';
import { ProductUsage, Product } from '../../types';

interface LocationAnalysisProps {
  productUsages: ProductUsage[];
  products: Product[];
}

export const LocationAnalysis: React.FC<LocationAnalysisProps> = ({
  productUsages,
  products
}) => {
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'מוצר לא ידוע';
  };

  const locationData = productUsages.reduce((acc, usage) => {
    const location = usage.location;
    if (!acc[location]) {
      acc[location] = {
        totalQuantity: 0,
        totalCost: 0,
        products: {} as Record<string, { quantity: number; cost: number; count: number }>
      };
    }
    
    acc[location].totalQuantity += usage.quantity;
    acc[location].totalCost += usage.cost;
    
    if (!acc[location].products[usage.productId]) {
      acc[location].products[usage.productId] = { quantity: 0, cost: 0, count: 0 };
    }
    
    acc[location].products[usage.productId].quantity += usage.quantity;
    acc[location].products[usage.productId].cost += usage.cost;
    acc[location].products[usage.productId].count += 1;
    
    return acc;
  }, {} as Record<string, { totalQuantity: number; totalCost: number; products: Record<string, { quantity: number; cost: number; count: number }> }>);

  const locations = Object.keys(locationData);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <MapPin className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">ניתוח לפי מיקומים</h3>
      </div>

      {locations.length > 0 ? (
        <div className="grid gap-6">
          {locations.map((location) => {
            const data = locationData[location];
            const productEntries = Object.entries(data.products);
            
            return (
              <div key={location} className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {location}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-800">סיכום כללי</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-blue-700">סך יחידות:</span>
                          <span className="font-bold text-blue-900">{data.totalQuantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">סך עלות:</span>
                          <span className="font-bold text-blue-900">{data.totalCost.toLocaleString()}₪</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      פירוט מוצרים
                    </h5>
                    <div className="space-y-2">
                      {productEntries.map(([productId, productData]) => (
                        <div key={productId} className="bg-gray-50 rounded-lg p-3">
                          <div className="font-medium text-gray-900 mb-1">
                            {getProductName(productId)}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>כמות כוללת:</span>
                              <span className="font-medium">{productData.quantity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>עלות כוללת:</span>
                              <span className="font-medium">{productData.cost.toLocaleString()}₪</span>
                            </div>
                            <div className="flex justify-between">
                              <span>מספר שימושים:</span>
                              <span className="font-medium">{productData.count}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">אין נתוני שימוש במוצרים להצגה</p>
        </div>
      )}
    </div>
  );
};