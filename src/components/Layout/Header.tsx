import React from 'react';
import { Building, ChevronDown } from 'lucide-react';
import { SupabaseStatus } from './SupabaseStatus';
import { Building as BuildingType } from '../../types';

interface HeaderProps {
  currentBuilding: BuildingType;
  buildings: BuildingType[];
  onBuildingChange: (buildingId: string) => void;
  appTitle: string;
  onSync: () => void;
  isLoading: boolean;
  error: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentBuilding,
  buildings,
  onBuildingChange,
  appTitle,
  onSync,
  isLoading,
  error
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Building className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">{appTitle}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <SupabaseStatus onSync={onSync} isLoading={isLoading} />
            
            {error && (
              <div className="text-xs text-red-600 max-w-xs truncate" title={error}>
                שגיאה: {error}
              </div>
            )}
            
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Building className="h-4 w-4" />
                <span className="font-medium">{currentBuilding.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-2">
                    {buildings.map((building) => (
                      <button
                        key={building.id}
                        onClick={() => {
                          onBuildingChange(building.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-right px-4 py-2 hover:bg-gray-50 transition-colors ${
                          building.id === currentBuilding.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        {building.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};