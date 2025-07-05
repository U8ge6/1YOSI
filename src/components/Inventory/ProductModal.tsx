import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Product } from '../../types';

interface ProductModalProps {
  product?: Product | null;
  onSave: (product: Omit<Product, 'id'>) => void;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: undefined as number | undefined,
    pricePerUnit: undefined as number | undefined
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        quantity: product.quantity,
        pricePerUnit: product.pricePerUnit
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure all required fields have valid values
    if (!formData.name.trim() || 
        formData.quantity === undefined || formData.quantity < 0 ||
        formData.pricePerUnit === undefined || formData.pricePerUnit < 0) {
      return;
    }
    
    onSave({
      name: formData.name.trim(),
      quantity: formData.quantity,
      pricePerUnit: formData.pricePerUnit
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {product ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם המוצר
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="למשל: נורות LED"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              כמות ראשונית
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.quantity !== undefined ? formData.quantity : ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                quantity: e.target.value ? parseInt(e.target.value) : undefined 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הזן כמות"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מחיר ליחידה (₪)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.pricePerUnit !== undefined ? formData.pricePerUnit : ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                pricePerUnit: e.target.value ? parseFloat(e.target.value) : undefined 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הזן מחיר"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || 
                       formData.quantity === undefined || formData.quantity < 0 ||
                       formData.pricePerUnit === undefined || formData.pricePerUnit < 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {product ? 'עדכן' : 'הוסף'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};