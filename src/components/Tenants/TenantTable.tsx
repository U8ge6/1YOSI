import React from 'react';
import { Edit2, Trash2, MessageCircle, Phone } from 'lucide-react';
import { Tenant } from '../../types';

interface TenantTableProps {
  tenants: Tenant[];
  onEditTenant: (tenant: Tenant) => void;
  onDeleteTenant: (tenantId: string) => void;
}

export const TenantTable: React.FC<TenantTableProps> = ({
  tenants,
  onEditTenant,
  onDeleteTenant
}) => {
  const handleWhatsApp = (tenant: Tenant) => {
    const phone = tenant.primaryPhone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `שלום ${tenant.name}, ${tenant.isDebtor ? 'אנא שלם את דמי הבית החסרים. תודה!' : 'תודה על התשלום בזמן!'}`
    );
    window.open(`https://wa.me/972${phone.substring(1)}?text=${message}`, '_blank');
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_blank');
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-right font-medium text-gray-700">דירה</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">קומה</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">שם</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">סטטוס בעלות</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">כניסה</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">טלפון</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">סכום חודשי</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">אמצעי תשלום</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">סטטוס</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">פעולות</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{tenant.apartment}</td>
              <td className="px-4 py-3 text-gray-600">{tenant.floor}</td>
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium text-gray-900">{tenant.name}</div>
                  {tenant.ownershipStatus === 'renter' && tenant.ownerName && (
                    <div className="text-xs text-gray-500">בעלים: {tenant.ownerName}</div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  tenant.ownershipStatus === 'owner' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {tenant.ownershipStatus === 'owner' ? 'בעלים' : 'שכירות'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{tenant.entrance}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{tenant.primaryPhone}</span>
                  <button
                    onClick={() => handleCall(tenant.primaryPhone)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title="התקשר"
                  >
                    <Phone className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleWhatsApp(tenant)}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                    title="שלח WhatsApp"
                  >
                    <MessageCircle className="h-3 w-3" />
                  </button>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">{tenant.monthlyAmount}₪</td>
              <td className="px-4 py-3">
                <div className="text-sm">
                  {tenant.paymentMethod === 'cash' ? 'מזומן' : 'אשראי'}
                  {tenant.paymentMethod === 'credit' && tenant.creditDay && (
                    <div className="text-xs text-gray-500">יום {tenant.creditDay}</div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  tenant.isDebtor 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {tenant.isDebtor ? 'חייב' : 'שולם'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditTenant(tenant)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title="ערוך"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTenant(tenant.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                    title="מחק"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {tenants.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          אין דיירים רשומים
        </div>
      )}
    </div>
  );
};