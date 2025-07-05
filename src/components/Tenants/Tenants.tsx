import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { TenantTable } from './TenantTable';
import { TenantModal } from './TenantModal';
import { Tenant, Building, AppState } from '../../types';

interface TenantsProps {
  tenants: Tenant[];
  building: Building;
  data: AppState;
  onAddTenant: (tenant: Omit<Tenant, 'id'>) => void;
  onUpdateTenant: (tenant: Tenant) => void;
  onDeleteTenant: (tenantId: string) => void;
}

export const Tenants: React.FC<TenantsProps> = ({
  tenants,
  building,
  data,
  onAddTenant,
  onUpdateTenant,
  onDeleteTenant
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [filterEntrance, setFilterEntrance] = useState<string>('all');

  const filteredTenants = filterEntrance === 'all' 
    ? tenants 
    : tenants.filter(t => t.entrance === filterEntrance);

  const handleAddTenant = (tenantData: Omit<Tenant, 'id'>) => {
    onAddTenant(tenantData);
    setIsModalOpen(false);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsModalOpen(true);
  };

  const handleUpdateTenant = (tenantData: Omit<Tenant, 'id'>) => {
    if (editingTenant) {
      onUpdateTenant({ ...tenantData, id: editingTenant.id });
      setEditingTenant(null);
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTenant(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">ניהול דיירים</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          הוסף דייר
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterEntrance}
            onChange={(e) => setFilterEntrance(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">כל הכניסות</option>
            {building.entrances.map(entrance => (
              <option key={entrance} value={entrance}>כניסה {entrance}</option>
            ))}
          </select>
        </div>

        <TenantTable
          tenants={filteredTenants}
          onEditTenant={handleEditTenant}
          onDeleteTenant={onDeleteTenant}
        />
      </div>

      {isModalOpen && (
        <TenantModal
          tenant={editingTenant}
          building={building}
          data={data}
          onSave={editingTenant ? handleUpdateTenant : handleAddTenant}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};