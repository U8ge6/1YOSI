import React, { useState, useEffect } from 'react';
import { X, Mail } from 'lucide-react';

interface AccountantEmailModalProps {
  currentEmail?: string;
  onSave: (email: string) => void;
  onClose: () => void;
}

export const AccountantEmailModal: React.FC<AccountantEmailModalProps> = ({
  currentEmail,
  onSave,
  onClose
}) => {
  const [email, setEmail] = useState(currentEmail || '');

  useEffect(() => {
    setEmail(currentEmail || '');
  }, [currentEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email.trim()) {
      onSave(email.trim());
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            הגדרת מייל רואה חשבון
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
              כתובת מייל רואה חשבון
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="accountant@example.com"
              dir="ltr"
            />
            {email && !isValidEmail(email) && (
              <p className="text-sm text-red-600 mt-1">
                אנא הזן כתובת מייל תקינה
              </p>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              💡 <strong>טיפ:</strong> כתובת המייל תישמר ותשמש לשליחת סיכומי שכר עובדים לרואה החשבון
            </p>
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
              disabled={!email.trim() || !isValidEmail(email)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              שמור
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};