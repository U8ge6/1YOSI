import React from 'react';
import { CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { Tenant, Payment } from '../../types';

interface PaymentsProps {
  tenants: Tenant[];
  payments: Payment[];
  currentYear: number;
  currentMonth: number;
  onUpdatePayment: (payment: Payment) => void;
  onMarkAllPaid: () => void;
}

const MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

export const Payments: React.FC<PaymentsProps> = ({
  tenants,
  payments,
  currentYear,
  currentMonth,
  onUpdatePayment,
  onMarkAllPaid
}) => {
  const getPaymentStatus = (tenantId: string, month: number) => {
    return payments.find(p => p.tenantId === tenantId && p.month === month && p.year === currentYear);
  };

  const togglePayment = (tenantId: string, month: number) => {
    const existingPayment = getPaymentStatus(tenantId, month);
    
    if (existingPayment) {
      onUpdatePayment({
        ...existingPayment,
        paid: !existingPayment.paid,
        date: !existingPayment.paid ? new Date().toISOString().split('T')[0] : undefined
      });
    } else {
      onUpdatePayment({
        tenantId,
        month,
        year: currentYear,
        paid: true,
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  // Create array of months from January to current month
  const visibleMonths = Array.from({ length: currentMonth }, (_, index) => index + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            מעקב גבייה - {currentYear}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            מוצגים חודשים עד {MONTHS[currentMonth - 1]} (חודש נוכחי)
          </p>
        </div>
        <button
          onClick={onMarkAllPaid}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          סמן הכל כשולם
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky right-0 bg-gray-50 px-4 py-3 text-right font-medium text-gray-700 border-l border-gray-200">
                  דייר / דירה
                </th>
                {visibleMonths.map((month) => (
                  <th key={month} className="px-3 py-3 text-center font-medium text-gray-700 min-w-[80px]">
                    {MONTHS[month - 1]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="sticky right-0 bg-white px-4 py-3 border-l border-gray-200">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{tenant.name}</div>
                      <div className="text-gray-500">דירה {tenant.apartment}</div>
                    </div>
                  </td>
                  {visibleMonths.map((month) => {
                    const payment = getPaymentStatus(tenant.id, month);
                    const isPaid = payment?.paid || false;
                    
                    return (
                      <td key={month} className="px-3 py-3 text-center">
                        <button
                          onClick={() => togglePayment(tenant.id, month)}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                            isPaid
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                          title={isPaid ? 'שולם' : 'לא שולם'}
                        >
                          {isPaid ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <XCircle className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {tenants.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            אין דיירים רשומים
          </div>
        )}
      </div>
    </div>
  );
};