import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Tenant, Building, AppState } from '../../types';

interface TenantModalProps {
  tenant?: Tenant | null;
  building: Building;
  data: AppState;
  onSave: (tenant: Omit<Tenant, 'id'>) => void;
  onClose: () => void;
}

export const TenantModal: React.FC<TenantModalProps> = ({
  tenant,
  building,
  data,
  onSave,
  onClose
}) => {
  // Get the default monthly amount for the current building
  const defaultMonthlyAmount = data.settings.monthlyAmount[data.currentBuildingId] || 450;

  const [formData, setFormData] = useState({
    apartment: '',
    floor: 1,
    name: '',
    ownershipStatus: 'owner' as 'owner' | 'renter',
    ownerName: '',
    ownerPhone: '',
    entrance: building.entrances[0] || '',
    primaryPhone: '',
    secondaryPhone: '',
    monthlyAmount: defaultMonthlyAmount, // Use building's default amount
    paymentMethod: 'cash' as 'cash' | 'credit',
    creditDay: 5,
    customAmount: undefined as number | undefined,
    isDebtor: false
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        apartment: tenant.apartment,
        floor: tenant.floor,
        name: tenant.name,
        ownershipStatus: tenant.ownershipStatus,
        ownerName: tenant.ownerName || '',
        ownerPhone: tenant.ownerPhone || '',
        entrance: tenant.entrance,
        primaryPhone: tenant.primaryPhone,
        secondaryPhone: tenant.secondaryPhone || '',
        monthlyAmount: tenant.monthlyAmount,
        paymentMethod: tenant.paymentMethod,
        creditDay: tenant.creditDay || 5,
        customAmount: tenant.customAmount,
        isDebtor: tenant.isDebtor
      });
    } else {
      // For new tenants, reset to building's default amount
      setFormData(prev => ({
        ...prev,
        monthlyAmount: defaultMonthlyAmount
      }));
    }
  }, [tenant, defaultMonthlyAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tenantData: Omit<Tenant, 'id'> = {
      apartment: formData.apartment,
      floor: formData.floor,
      name: formData.name,
      ownershipStatus: formData.ownershipStatus,
      ownerName: formData.ownershipStatus === 'renter' ? formData.ownerName : undefined,
      ownerPhone: formData.ownershipStatus === 'renter' ? formData.ownerPhone : undefined,
      entrance: formData.entrance,
      primaryPhone: formData.primaryPhone,
      secondaryPhone: formData.secondaryPhone || undefined,
      monthlyAmount: formData.monthlyAmount,
      paymentMethod: formData.paymentMethod,
      creditDay: formData.paymentMethod === 'credit' ? formData.creditDay : undefined,
      customAmount: formData.customAmount,
      isDebtor: formData.isDebtor
    };

    onSave(tenantData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {tenant ? 'עריכת דייר' : 'הוספת דייר חדש'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מספר דירה
              </label>
              <input
                type="text"
                required
                value={formData.apartment}
                onChange={(e) => setFormData(prev => ({ ...prev, apartment: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                קומה
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.floor}
                onChange={(e) => setFormData(prev => ({ ...prev, floor: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם הדייר
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                סטטוס בעלות
              </label>
              <select
                value={formData.ownershipStatus}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  ownershipStatus: e.target.value as 'owner' | 'renter' 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="owner">בעלים</option>
                <option value="renter">שכירות</option>
              </select>
            </div>

            {formData.ownershipStatus === 'renter' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    שם בעל הדירה
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    טלפון בעל הדירה
                  </label>
                  <input
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                כניסה
              </label>
              <select
                value={formData.entrance}
                onChange={(e) => setFormData(prev => ({ ...prev, entrance: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {building.entrances.map(entrance => (
                  <option key={entrance} value={entrance}>כניסה {entrance}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                טלפון ראשי
              </label>
              <input
                type="tel"
                required
                value={formData.primaryPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryPhone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                טלפון נוסף (אופציונלי)
              </label>
              <input
                type="tel"
                value={formData.secondaryPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, secondaryPhone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                סכום חודשי (₪)
                <span className="text-xs text-gray-500 block">
                  ברירת מחדל: {defaultMonthlyAmount}₪ (ניתן לשנות עבור דייר זה)
                </span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.monthlyAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyAmount: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`ברירת מחדל: ${defaultMonthlyAmount}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                אמצעי תשלום
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  paymentMethod: e.target.value as 'cash' | 'credit' 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cash">מזומן</option>
                <option value="credit">אשראי</option>
              </select>
            </div>

            {formData.paymentMethod === 'credit' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  יום חיוב בחודש
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.creditDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, creditDay: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDebtor"
              checked={formData.isDebtor}
              onChange={(e) => setFormData(prev => ({ ...prev, isDebtor: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isDebtor" className="text-sm text-gray-700">
              דייר חייב
            </label>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {tenant ? 'עדכן' : 'הוסף'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};