import React, { useState } from 'react';
import { History, Filter, Calendar, Edit2, Trash2 } from 'lucide-react';
import { ProductHistory, Product } from '../../types';

interface ActionHistoryProps {
  productHistory: ProductHistory[];
  products: Product[];
  onEditHistory: (history: ProductHistory) => void;
  onDeleteHistory: (historyId: string) => void;
}

export const ActionHistory: React.FC<ActionHistoryProps> = ({
  productHistory,
  products,
  onEditHistory,
  onDeleteHistory
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'30days' | 'all'>('30days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'מוצר לא ידוע';
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
        return 'bg-blue-100 text-blue-800';
      case 'add':
        return 'bg-green-100 text-green-800';
      case 'use':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filterHistory = () => {
    let filtered = [...productHistory];
    
    if (filterPeriod === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(h => new Date(h.date) >= thirtyDaysAgo);
    } else if (startDate && endDate) {
      filtered = filtered.filter(h => {
        const historyDate = new Date(h.date);
        return historyDate >= new Date(startDate) && historyDate <= new Date(endDate);
      });
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredHistory = filterHistory();

  const handleEdit = (history: ProductHistory) => {
    onEditHistory(history);
  };

  const handleDelete = (historyId: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק רשומה זו? פעולה זו תעדכן את המלאי וההוצאות בהתאם.')) {
      onDeleteHistory(historyId);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <History className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">היסטוריית פעולות</h3>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <Filter className="h-5 w-5 text-gray-400" />
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilterPeriod('30days')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filterPeriod === '30days'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              30 יום אחרונים
            </button>
            <button
              onClick={() => setFilterPeriod('all')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filterPeriod === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              כל ההיסטוריה
            </button>
          </div>

          {filterPeriod === 'all' && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="מתאריך"
              />
              <span className="text-gray-500">עד</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="עד תאריך"
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right font-medium text-gray-700">תאריך ושעה</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">מוצר</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">פעולה</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">כמות</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">מיקום</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">עלות</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">הערות</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHistory.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(record.date).toLocaleDateString('he-IL')}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {getProductName(record.productId)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getActionColor(record.action)}`}>
                      {getActionLabel(record.action)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${record.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {record.quantity > 0 ? '+' : ''}{record.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {record.location || '-'}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {record.cost.toLocaleString()}₪
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {record.notes || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {record.action === 'use' && (
                        <>
                          <button
                            onClick={() => handleEdit(record)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="ערוך"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="מחק"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {record.action !== 'use' && (
                        <span className="text-xs text-gray-500">לא ניתן לערוך</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredHistory.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            אין היסטוריית פעולות להצגה
          </div>
        )}
      </div>
    </div>
  );
};