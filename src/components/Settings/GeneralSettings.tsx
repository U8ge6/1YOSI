import React, { useState } from 'react';
import { Save, GripVertical } from 'lucide-react';
import { AppState } from '../../types';

interface GeneralSettingsProps {
  data: AppState;
  onUpdateSettings: (data: AppState) => void;
}

const TAB_LABELS = {
  dashboard: 'לוח בקרה',
  tenants: 'דיירים',
  payments: 'גבייה',
  expenses: 'הוצאות כלליות',
  'petty-cash': 'קופה קטנה',
  employees: 'ניהול עובדים',
  issues: 'תקלות',
  inventory: 'ניהול מלאי',
  settings: 'הגדרות'
};

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  data,
  onUpdateSettings
}) => {
  const [appTitle, setAppTitle] = useState(data.settings.appTitle);
  const [tabOrder, setTabOrder] = useState(data.settings.tabOrder);
  const [monthlyAmount, setMonthlyAmount] = useState(data.settings.monthlyAmount[data.currentBuildingId] || 450);
  const [pettyCashTransfer, setPettyCashTransfer] = useState(data.settings.pettyCashTransfer[data.currentBuildingId] || 50);
  const [whatsappTemplate, setWhatsappTemplate] = useState(data.settings.whatsappTemplate);

  const handleSave = () => {
    const updatedData = {
      ...data,
      settings: {
        ...data.settings,
        appTitle,
        tabOrder,
        monthlyAmount: {
          ...data.settings.monthlyAmount,
          [data.currentBuildingId]: monthlyAmount
        },
        pettyCashTransfer: {
          ...data.settings.pettyCashTransfer,
          [data.currentBuildingId]: pettyCashTransfer
        },
        whatsappTemplate
      }
    };
    onUpdateSettings(updatedData);
  };

  const moveTab = (fromIndex: number, toIndex: number) => {
    const newTabOrder = [...tabOrder];
    const [movedTab] = newTabOrder.splice(fromIndex, 1);
    newTabOrder.splice(toIndex, 0, movedTab);
    setTabOrder(newTabOrder);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">הגדרות כלליות</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              כותרת המערכת
            </label>
            <input
              type="text"
              value={appTitle}
              onChange={(e) => setAppTitle(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סדר לשוניות
            </label>
            <div className="space-y-2 max-w-md">
              {tabOrder.map((tab, index) => (
                <div
                  key={tab}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  <span className="flex-1">{TAB_LABELS[tab as keyof typeof TAB_LABELS]}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => index > 0 && moveTab(index, index - 1)}
                      disabled={index === 0}
                      className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => index < tabOrder.length - 1 && moveTab(index, index + 1)}
                      disabled={index === tabOrder.length - 1}
                      className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">הגדרות בניין נוכחי</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סכום גבייה חודשי (₪)
            </label>
            <input
              type="number"
              min="0"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              העברה לקופה קטנה (₪)
            </label>
            <input
              type="number"
              min="0"
              value={pettyCashTransfer}
              onChange={(e) => setPettyCashTransfer(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">תבנית הודעת WhatsApp</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            תבנית הודעה
          </label>
          <textarea
            value={whatsappTemplate}
            onChange={(e) => setWhatsappTemplate(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            placeholder="שלום {שם}, אנא שלם את דמי הבית עבור {חודשים}. סה״כ לתשלום: {סכום_כולל}₪. תודה!"
          />
          <p className="text-xs text-gray-500 mt-1">
            ניתן להשתמש בתגים: {'{שם}'}, {'{חודשים}'}, {'{סכום_כולל}'}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          שמור הגדרות
        </button>
      </div>
    </div>
  );
};