import React from 'react';
import { X, Plus, Minus, Package } from 'lucide-react';
import { Product, ProductHistory } from '../../types';

interface ProductHistoryModalProps {
  product: Product;
  productHistory: ProductHistory[];
  onClose: () => void;
}

export const ProductHistoryModal: React.FC<ProductHistoryModalProps> = ({
  product,
  productHistory,
  onClose
}) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'add':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'use':
        return <Minus className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'create':
        return 'יצירת מוצר';
      case 'add':
        return 'הוספת מלאי';
      case 'use':
        return 'שימוש במוצר';
      default:
        return action;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-blue-50 text-blue-800';
      case 'add':
        return 'bg-green-50 text-green-800';
      case 'use':
        return 'bg-red-50 text-red-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  const sortedHistory = [...productHistory].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            היסטוריית מוצר - {product.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">מלאי נוכחי:</span>
                <div className="font-bold text-lg">{product.quantity} יחידות</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">מחיר ליחידה:</span>
                <div className="font-bold text-lg">{product.pricePerUnit}₪</div>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto max-h-96">
            {sortedHistory.length > 0 ? (
              <div className="space-y-3">
                {sortedHistory.map((record) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getActionIcon(record.action)}
                        <span className={`px-2 py-1 text-xs rounded-full ${getActionColor(record.action)}`}>
                          {getActionLabel(record.action)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">כמות: </span>
                        <span className={`font-medium ${record.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {record.quantity > 0 ? '+' : ''}{record.quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">עלות: </span>
                        <span className="font-medium">{record.cost.toLocaleString()}₪</span>
                      </div>
                    </div>
                    
                    {record.location && (
                      <div className="text-sm mt-2">
                        <span className="text-gray-600">מיקום: </span>
                        <span className="font-medium">{record.location}</span>
                      </div>
                    )}
                    
                    {record.notes && (
                      <div className="text-sm mt-2">
                        <span className="text-gray-600">הערות: </span>
                        <span className="text-gray-800">{record.notes}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                אין היסטוריה זמינה עבור מוצר זה
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};