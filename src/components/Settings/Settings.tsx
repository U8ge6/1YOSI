import React, { useState } from 'react';
import { Settings as SettingsIcon, Building, Download } from 'lucide-react';
import { GeneralSettings } from './GeneralSettings';
import { BuildingSettings } from './BuildingSettings';
import { BackupRestore } from './BackupRestore';
import { AppState } from '../../types';

interface SettingsProps {
  data: AppState;
  onUpdateSettings: (data: AppState) => void;
}

const SETTINGS_TABS = [
  { id: 'general', label: 'הגדרות כלליות', icon: SettingsIcon },
  { id: 'buildings', label: 'ניהול בניינים', icon: Building },
  { id: 'backup', label: 'גיבוי ושחזור', icon: Download }
];

export const Settings: React.FC<SettingsProps> = ({
  data,
  onUpdateSettings
}) => {
  const [activeTab, setActiveTab] = useState('general');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings data={data} onUpdateSettings={onUpdateSettings} />;
      case 'buildings':
        return <BuildingSettings data={data} onUpdateSettings={onUpdateSettings} />;
      case 'backup':
        return <BackupRestore data={data} onUpdateSettings={onUpdateSettings} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <SettingsIcon className="h-6 w-6 text-gray-600" />
        הגדרות
      </h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-gray-500 text-gray-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};