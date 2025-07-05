import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Issue, Building } from '../../types';

interface IssueModalProps {
  issue?: Issue | null;
  building?: Building;
  onSave: (issue: Omit<Issue, 'id'>) => void;
  onClose: () => void;
}

export const IssueModal: React.FC<IssueModalProps> = ({
  issue,
  building,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    reporterName: '',
    description: '',
    repairCost: undefined as number | undefined,
    status: 'open' as 'open' | 'in-progress' | 'resolved',
    notes: '',
    entrance: ''
  });

  useEffect(() => {
    if (issue) {
      setFormData({
        date: issue.date,
        reporterName: issue.reporterName,
        description: issue.description,
        repairCost: issue.repairCost,
        status: issue.status,
        notes: issue.notes || '',
        entrance: issue.entrance || ''
      });
    }
  }, [issue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      notes: formData.notes.trim() || undefined,
      entrance: formData.entrance.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {issue ? 'עריכת תקלה' : 'דיווח תקלה חדשה'}
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
              תאריך דיווח
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם המדווח
            </label>
            <input
              type="text"
              required
              value={formData.reporterName}
              onChange={(e) => setFormData(prev => ({ ...prev, reporterName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="למשל: דוד כהן"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תיאור התקלה
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="תאר את התקלה בפירוט..."
            />
          </div>

          {building && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                כניסה (אופציונלי)
              </label>
              <select
                value={formData.entrance}
                onChange={(e) => setFormData(prev => ({ ...prev, entrance: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">כל הבניין</option>
                {building.entrances.map(entrance => (
                  <option key={entrance} value={entrance}>כניסה {entrance}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              עלות תיקון (₪) - אופציונלי
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.repairCost || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                repairCost: e.target.value ? parseFloat(e.target.value) : undefined 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="הזן עלות רק אם ידועה"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סטטוס
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                status: e.target.value as 'open' | 'in-progress' | 'resolved' 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="open">פתוח</option>
              <option value="in-progress">בטיפול</option>
              <option value="resolved">טופל</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              הערות (אופציונלי)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="הערות נוספות..."
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
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {issue ? 'עדכן' : 'דווח'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};