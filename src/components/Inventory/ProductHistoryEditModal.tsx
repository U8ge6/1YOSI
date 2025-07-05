import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ProductHistory, Product } from '../../types';

interface ProductHistoryEditModalProps {
  history: ProductHistory;
  products: Product[];
  onSave: (updatedHistory: ProductHistory) => void;
  onClose: () => void;
}

export const ProductHistoryEditModal: React.FC<ProductHistoryEditModalProps> = ({
  history,
  products,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    date: history.date,
    quantity: Math.abs(history.quantity), // Always show positive for editing
    location: history.location || '',
    notes: history.notes || '',
    cost: history.cost
  });

  const product = products.find(p => p.id === history.productId);

  useEffect(() => {
    // Recalculate cost when quantity changes
    if (product) {
      setFormData(prev => ({
        ...prev,
        cost: prev.quantity * product.pricePerUnit
      }));
    }
  }, [formData.quantity, product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedHistory: ProductHistory = {
      ...history,
      date: formData.date,
      quantity: -formData.quantity, // Keep negative for 'use' action
      location: formData.location,
      notes: formData.notes.trim() || undefined,
      cost: formData.cost
    };

    onSave(updatedHistory);
  };

  if (!product) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            עריכת שימוש במוצר - {product.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">מוצר:</span>
              <span className="font-medium">{product.name}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-600">מחיר ליחידה:</span>
              <span className="font-medium">{product.pricePerUnit}₪</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תאריך
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              כמות שנוצלה
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מיקום
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="מיקום השימוש"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              הערות
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הערות על השימוש"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">עלות מעודכנת:</span>
              <span className="font-bold text-blue-900">{formData.cost.toLocaleString()}₪</span>
            </div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              עדכן
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};