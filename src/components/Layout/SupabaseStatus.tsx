import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, Wifi, WifiOff, RefreshCw, Save } from 'lucide-react';

interface SupabaseStatusProps {
  onSync: () => void;
  isLoading: boolean;
}

export const SupabaseStatus: React.FC<SupabaseStatusProps> = ({ onSync, isLoading }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = () => {
    onSync();
    setLastSync(new Date());
  };

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-600';
    return 'text-green-600';
  };

  const getStatusText = () => {
    if (!isOnline) return 'לא מחובר לאינטרנט';
    return 'שמירה מקומית פעילה';
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSync}
        disabled={isLoading}
        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="שמור עכשיו"
      >
        <Save className={`h-3 w-3 ${isLoading ? 'animate-pulse' : ''}`} />
        שמור
      </button>
      
      <div className="flex items-center gap-1" title={getStatusText()}>
        {isOnline ? (
          <Wifi className="h-3 w-3 text-green-600" />
        ) : (
          <WifiOff className="h-3 w-3 text-red-600" />
        )}
        
        <Cloud className={`h-3 w-3 ${getStatusColor()}`} />
        
        <span className={`text-xs ${getStatusColor()}`}>
          {lastSync && (
            <span className="text-gray-500">
              {lastSync.toLocaleTimeString('he-IL', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};