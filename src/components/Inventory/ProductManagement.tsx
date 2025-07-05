import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package, Eye } from 'lucide-react';
import { Product, ProductHistory } from '../../types';
import { ProductModal } from './ProductModal';
import { AddStockModal } from './AddStockModal';
import { ProductHistoryModal } from './ProductHistoryModal';

interface ProductManagementProps {
  products: Product[];
  productHistory: ProductHistory[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddStock: (productId: string, quantity: number, notes?: string) => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  productHistory,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddStock
}) => {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    onAddProduct(productData);
    setIsProductModalOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleUpdateProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      onUpdateProduct({ ...productData, id: editingProduct.id });
      setEditingProduct(null);
      setIsProductModalOpen(false);
    }
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleAddStock = (productId: string) => {
    setSelectedProductId(productId);
    setIsAddStockModalOpen(true);
  };

  const handleAddStockSubmit = (quantity: number, notes?: string) => {
    onAddStock(selectedProductId, quantity, notes);
    setIsAddStockModalOpen(false);
    setSelectedProductId('');
  };

  const handleViewHistory = (productId: string) => {
    setSelectedProductId(productId);
    setIsHistoryModalOpen(true);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return 'text-red-600 bg-red-100';
    if (quantity <= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const totalInventoryValue = products.reduce((sum, product) => 
    sum + (product.quantity * product.pricePerUnit), 0
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">ניהול מוצרים</h3>
          <p className="text-sm text-gray-600 mt-1">
            ערך מלאי כולל: <span className="font-medium">{totalInventoryValue.toLocaleString()}₪</span>
          </p>
        </div>
        <button
          onClick={() => setIsProductModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          הוסף מוצר חדש
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right font-medium text-gray-700">שם המוצר</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">כמות במלאי</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">מחיר ליחידה</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">ערך כולל</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewHistory(product.id)}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline text-right"
                    >
                      {product.name}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.quantity}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStockStatus(product.quantity)}`}>
                        {product.quantity === 0 ? 'אזל' : product.quantity <= 5 ? 'נמוך' : 'זמין'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.pricePerUnit}₪</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {(product.quantity * product.pricePerUnit).toLocaleString()}₪
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddStock(product.id)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="הוסף מלאי"
                      >
                        <Package className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleViewHistory(product.id)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="צפה בהיסטוריה"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="ערוך"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="מחק"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            אין מוצרים רשומים
          </div>
        )}
      </div>

      {isProductModalOpen && (
        <ProductModal
          product={editingProduct}
          onSave={editingProduct ? handleUpdateProduct : handleAddProduct}
          onClose={handleCloseProductModal}
        />
      )}

      {isAddStockModalOpen && (
        <AddStockModal
          product={products.find(p => p.id === selectedProductId)!}
          onSave={handleAddStockSubmit}
          onClose={() => setIsAddStockModalOpen(false)}
        />
      )}

      {isHistoryModalOpen && (
        <ProductHistoryModal
          product={products.find(p => p.id === selectedProductId)!}
          productHistory={productHistory.filter(h => h.productId === selectedProductId)}
          onClose={() => setIsHistoryModalOpen(false)}
        />
      )}
    </div>
  );
};