import React, { useState } from 'react';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { Product, ProductUsage as ProductUsageType, Building } from '../../types';

interface ProductUsageProps {
  products: Product[];
  currentLocation: string;
  building?: Building;
  onUseProduct: (usage: Omit<ProductUsageType, 'id'>) => void;
}

export const ProductUsage: React.FC<ProductUsageProps> = ({
  products,
  currentLocation,
  building,
  onUseProduct
}) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedEntrance, setSelectedEntrance] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return { color: 'text-red-600 bg-red-100', label: 'אזל', icon: AlertTriangle };
    if (product.quantity <= 5) return { color: 'text-yellow-600 bg-yellow-100', label: 'נמוך', icon: AlertTriangle };
    return { color: 'text-blue-600 bg-blue-100', label: 'זמין', icon: Package };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || quantity > selectedProduct.quantity) {
      return;
    }

    // Create location string with entrance if selected
    let locationString = currentLocation;
    if (selectedEntrance) {
      locationString += ` - כניסה ${selectedEntrance}`;
    }

    const usage: Omit<ProductUsageType, 'id'> = {
      productId: selectedProductId,
      quantity,
      location: locationString,
      date: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined,
      cost: quantity * selectedProduct.pricePerUnit
    };

    onUseProduct(usage);
    
    // Reset form
    setSelectedProductId('');
    setQuantity(1);
    setNotes('');
    setSelectedEntrance('');
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">רישום שימוש במוצרים</h3>
        <p className="text-gray-600">בחר מוצר והזן את הכמות שנלקחה מהמלאי</p>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800">השימוש נרשם בהצלחה!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            בחר מוצר
          </label>
          <select
            required
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- בחר מוצר --</option>
            {products.map((product) => {
              const status = getStockStatus(product);
              return (
                <option key={product.id} value={product.id} disabled={product.quantity === 0}>
                  {product.name} - {product.quantity} יחידות במלאי
                </option>
              );
            })}
          </select>
          
          {selectedProduct && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">מלאי נוכחי:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedProduct.quantity} יחידות</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStockStatus(selectedProduct).color}`}>
                    {getStockStatus(selectedProduct).label}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-600">מחיר ליחידה:</span>
                <span className="font-medium">{selectedProduct.pricePerUnit}₪</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            כמות לשימוש
          </label>
          <input
            type="number"
            required
            min="1"
            max={selectedProduct?.quantity || 1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {selectedProduct && quantity > selectedProduct.quantity && (
            <p className="mt-1 text-sm text-red-600">
              הכמות המבוקשת גדולה מהמלאי הקיים
            </p>
          )}
        </div>

        {building && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כניסה ספציפית (אופציונלי)
            </label>
            <select
              value={selectedEntrance}
              onChange={(e) => setSelectedEntrance(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">כל הבניין</option>
              {building.entrances.map(entrance => (
                <option key={entrance} value={entrance}>כניסה {entrance}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הערות (אופציונלי)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="למשל: החלפת נורות בחדר מדרגות"
          />
        </div>

        {selectedProduct && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">עלות מוערכת:</span>
              <span className="font-bold text-blue-900">
                {(quantity * selectedProduct.pricePerUnit).toLocaleString()}₪
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedProduct || quantity > selectedProduct.quantity}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          רשום שימוש
        </button>
      </form>
    </div>
  );
};