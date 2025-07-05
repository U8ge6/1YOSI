import React, { useRef } from 'react';
import { Download, Upload, Trash2, AlertTriangle, Cloud, DownloadCloud as CloudDownload } from 'lucide-react';
import { AppState } from '../../types';

interface BackupRestoreProps {
  data: AppState;
  onUpdateSettings: (data: AppState) => void;
}

export const BackupRestore: React.FC<BackupRestoreProps> = ({
  data,
  onUpdateSettings
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `building-management-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        if (!confirm('האם אתה בטוח שברצונך לשחזר את הנתונים? כל הנתונים הנוכחיים יוחלפו!')) {
          return;
        }
        
        onUpdateSettings(importedData);
        
        // Save to localStorage immediately
        localStorage.setItem('building-management-data', JSON.stringify(importedData));
        
        alert('הנתונים שוחזרו בהצלחה!');
      } catch (error) {
        alert('שגיאה בקריאת הקובץ. אנא ודא שהקובץ תקין.');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetAll = () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו בלתי הפיכה!')) {
      return;
    }
    
    if (!confirm('זוהי אזהרה אחרונה! כל הנתונים יימחקו לצמיתות. האם להמשיך?')) {
      return;
    }

    // Reset to initial state with one empty building
    const resetData: AppState = {
      currentBuildingId: 'building-1',
      buildings: [{
        id: 'building-1',
        name: 'בניין חדש',
        entrances: ['א']
      }],
      tenants: { 'building-1': [] },
      payments: { 'building-1': [] },
      expenses: { 'building-1': [] },
      pettyCash: { 'building-1': [] },
      employees: { 'building-1': [] },
      issues: { 'building-1': [] },
      products: [],
      productUsages: [],
      productHistory: [],
      settings: {
        appTitle: 'ניהול בניין משותף',
        tabOrder: ['dashboard', 'tenants', 'payments', 'expenses', 'petty-cash', 'employees', 'issues', 'inventory', 'settings'],
        monthlyAmount: { 'building-1': 450 },
        pettyCashTransfer: { 'building-1': 50 },
        whatsappTemplate: 'שלום {שם}, אנא שלם את דמי הבית עבור {חודשים}. סה"כ לתשלום: {סכום_כולל}₪. תודה!'
      }
    };

    onUpdateSettings(resetData);
    
    // Clear localStorage
    localStorage.removeItem('building-management-data');
    
    alert('כל הנתונים נמחקו בהצלחה!');
  };

  const handleSyncData = () => {
    // Force save current data
    localStorage.setItem('building-management-data', JSON.stringify(data));
    
    // Show sync indicator
    const saveIndicator = document.getElementById('save-indicator');
    if (saveIndicator) {
      saveIndicator.textContent = 'סונכרן ✓';
      saveIndicator.className = 'text-green-600 text-sm';
      setTimeout(() => {
        if (saveIndicator) {
          saveIndicator.textContent = '';
        }
      }, 2000);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">שמירה וסנכרון אוטומטי</h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Cloud className="h-6 w-6 text-blue-600" />
            <h4 className="font-medium text-blue-900">מערכת שמירה אוטומטית</h4>
          </div>
          <p className="text-sm text-blue-700 mb-4">
            כל הנתונים נשמרים אוטומטית במכשיר שלך ויהיו זמינים בכל פעם שתיכנס לאתר מאותו מכשיר.
            הנתונים מסונכרנים בין כל הלשוניות הפתוחות באותו דפדפן.
          </p>
          <button
            onClick={handleSyncData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <CloudDownload className="h-4 w-4" />
            סנכרן עכשיו
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">גיבוי ושחזור נתונים</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Data */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Download className="h-6 w-6 text-green-600" />
              <h4 className="font-medium text-green-900">ייצוא נתונים</h4>
            </div>
            <p className="text-sm text-green-700 mb-4">
              יצירת קובץ גיבוי המכיל את כל הנתונים של כל הבניינים במערכת.
              מומלץ לייצא גיבוי באופן קבוע.
            </p>
            <button
              onClick={handleExportData}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              הורד קובץ גיבוי
            </button>
          </div>

          {/* Import Data */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="h-6 w-6 text-orange-600" />
              <h4 className="font-medium text-orange-900">ייבוא נתונים</h4>
            </div>
            <p className="text-sm text-orange-700 mb-4">
              שחזור נתונים מקובץ גיבוי. כל הנתונים הנוכחיים יוחלפו!
              השתמש בזה כדי להעביר נתונים בין מכשירים.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              בחר קובץ לשחזור
            </button>
          </div>
        </div>
      </div>

      {/* Reset All Data */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h4 className="font-medium text-red-900">איפוס כללי</h4>
        </div>
        <p className="text-sm text-red-700 mb-4">
          מחיקת כל הנתונים מהמערכת והתחלה מחדש. פעולה זו בלתי הפיכה!
        </p>
        <button
          onClick={handleResetAll}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          מחק הכל והתחל מחדש
        </button>
      </div>
    </div>
  );
};