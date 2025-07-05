import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '../../types';

interface AddStockModalProps {
  product: Product;
  onSave: (quantity: number, notes?: string) => void;
  onClose: () => void;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({
  product,
  onSave,
  onClose
}) => {
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity && quantity > 0) {
      onSave(quantity, notes.trim() || undefined);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            הוספת מלאי - {product.name}
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
              <span className="text-sm text-gray-600">מלאי נוכחי:</span>
              <span className="font-medium">{product.quantity} יחידות</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-600">מחיר ליחידה:</span>
              <span className="font-medium">{product.pricePerUnit}₪</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              כמות להוספה
            </label>
            <input
              type="number"
              required
              min="1"
              value={quantity !== undefined ? quantity : ''}
              onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הזן כמות"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              הערות (אופציונלי)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="למשל: קנייה חדשה מהספק"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">מלאי לאחר הוספה:</span>
              <span className="font-bold text-blue-900">
                {quantity ? product.quantity + quantity : product.quantity} יחידות
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-blue-800">עלות הוספה:</span>
              <span className="font-bold text-blue-900">
                {quantity ? (quantity * product.pricePerUnit).toLocaleString() : 0}₪
              </span>
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
              disabled={!quantity || quantity <= 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              הוסף למלאי
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};