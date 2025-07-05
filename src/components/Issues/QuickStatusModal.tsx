import React, { useState } from 'react';
import { X, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Issue } from '../../types';

interface QuickStatusModalProps {
  issue: Issue;
  onSave: (issue: Issue) => void;
  onClose: () => void;
}

export const QuickStatusModal: React.FC<QuickStatusModalProps> = ({
  issue,
  onSave,
  onClose
}) => {
  const [selectedStatus, setSelectedStatus] = useState(issue.status);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'פתוח';
      case 'in-progress':
        return 'בטיפול';
      case 'resolved':
        return 'טופל';
      default:
        return status;
    }
  };

  const handleSave = () => {
    onSave({ ...issue, status: selectedStatus });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            שינוי סטטוס תקלה
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">תיאור תקלה:</p>
            <p className="font-medium text-gray-900">{issue.description}</p>
            <p className="text-sm text-gray-600 mt-2">סטטוס נוכחי:</p>
            <div className="flex items-center gap-2 mt-1">
              {getStatusIcon(issue.status)}
              <span className="font-medium text-gray-900">{getStatusLabel(issue.status)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              בחר סטטוס חדש
            </label>
            <div className="space-y-2">
              {['open', 'in-progress', 'resolved'].map((status) => (
                <label key={status} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={selectedStatus === status}
                    onChange={(e) => setSelectedStatus(e.target.value as 'open' | 'in-progress' | 'resolved')}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <span className="font-medium">{getStatusLabel(status)}</span>
                  </div>
                </label>
              ))}
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
              type="button"
              onClick={handleSave}
              disabled={selectedStatus === issue.status}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              שמור שינוי
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};