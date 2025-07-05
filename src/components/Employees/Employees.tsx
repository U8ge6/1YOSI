import React, { useState } from 'react';
import { Plus, UserCheck, Mail, Send, Calendar } from 'lucide-react';
import { EmployeeCard } from './EmployeeCard';
import { EmployeeModal } from './EmployeeModal';
import { AccountantEmailModal } from './AccountantEmailModal';
import { Employee, AppState } from '../../types';

interface EmployeesProps {
  employees: Employee[];
  accountantEmail?: string;
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  onUpdateEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
  onUpdateSettings: (data: AppState) => void;
  data: AppState;
}

const MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

export const Employees: React.FC<EmployeesProps> = ({
  employees,
  accountantEmail,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onUpdateSettings,
  data
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isAccountantEmailModalOpen, setIsAccountantEmailModalOpen] = useState(false);

  // Initialize with previous month
  const now = new Date();
  const previousMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const previousYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  
  const [selectedMonth, setSelectedMonth] = useState(previousMonth + 1); // 1-based
  const [selectedYear, setSelectedYear] = useState(previousYear);

  const handleAddEmployee = (employeeData: Omit<Employee, 'id'>) => {
    onAddEmployee(employeeData);
    setIsModalOpen(false);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleUpdateEmployee = (employeeData: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      onUpdateEmployee({ ...employeeData, id: editingEmployee.id });
      setEditingEmployee(null);
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSaveAccountantEmail = (email: string) => {
    const updatedData = {
      ...data,
      settings: {
        ...data.settings,
        accountantEmail: email
      }
    };
    onUpdateSettings(updatedData);
    setIsAccountantEmailModalOpen(false);
  };

  const handleSendEmailToAccountant = () => {
    if (!accountantEmail) {
      alert('אנא הגדר תחילה את כתובת המייל של רואה החשבון');
      return;
    }

    // Filter employees who were working during the selected month
    const lastDayOfMonth = new Date(selectedYear, selectedMonth, 0);
    const activeEmployees = employees.filter(employee => {
      const startDate = new Date(employee.startDate);
      return startDate <= lastDayOfMonth;
    });

    if (activeEmployees.length === 0) {
      alert('אין עובדים שעבדו בחודש הנבחר');
      return;
    }

    // Build email subject
    const monthName = MONTHS[selectedMonth - 1];
    const subject = `סיכום שכר עובדים - ${monthName} ${selectedYear}`;

    // Build email body
    let emailBody = `שלום,\n\nמצורף סיכום שכר עובדים עבור ${monthName} ${selectedYear}:\n\n`;

    activeEmployees.forEach((employee, index) => {
      const currentMonthAbsences = employee.absences.filter(absence => {
        const absenceDate = new Date(absence.date);
        return absenceDate.getMonth() + 1 === selectedMonth && absenceDate.getFullYear() === selectedYear;
      });

      const dailyWage = employee.baseSalary / employee.workDaysPerMonth;
      const totalDeduction = currentMonthAbsences.length * dailyWage;
      const finalSalary = employee.baseSalary - totalDeduction;

      emailBody += `${index + 1}. ${employee.name}\n`;
      emailBody += `   שכר בסיס: ${employee.baseSalary.toLocaleString()}₪\n`;
      emailBody += `   ימי עבודה בחודש: ${employee.workDaysPerMonth}\n`;
      emailBody += `   שווי יום עבודה: ${dailyWage.toFixed(2)}₪\n`;
      
      if (currentMonthAbsences.length > 0) {
        emailBody += `   היעדרויות החודש:\n`;
        currentMonthAbsences.forEach(absence => {
          emailBody += `     - ${new Date(absence.date).toLocaleDateString('he-IL')}: ${absence.reason}\n`;
        });
        emailBody += `   סך ימי היעדרות: ${currentMonthAbsences.length}\n`;
        emailBody += `   ניכוי כולל: ${totalDeduction.toFixed(2)}₪\n`;
      } else {
        emailBody += `   אין היעדרויות החודש\n`;
      }
      
      emailBody += `   שכר סופי: ${finalSalary.toFixed(2)}₪\n\n`;
    });

    const totalBaseSalary = activeEmployees.reduce((sum, emp) => sum + emp.baseSalary, 0);
    const totalFinalSalary = activeEmployees.reduce((sum, emp) => {
      const currentMonthAbsences = emp.absences.filter(absence => {
        const absenceDate = new Date(absence.date);
        return absenceDate.getMonth() + 1 === selectedMonth && absenceDate.getFullYear() === selectedYear;
      });
      const dailyWage = emp.baseSalary / emp.workDaysPerMonth;
      const totalDeduction = currentMonthAbsences.length * dailyWage;
      return sum + (emp.baseSalary - totalDeduction);
    }, 0);

    emailBody += `סיכום כללי:\n`;
    emailBody += `סך שכר בסיס: ${totalBaseSalary.toLocaleString()}₪\n`;
    emailBody += `סך שכר סופי: ${totalFinalSalary.toFixed(2)}₪\n`;
    emailBody += `סך ניכויים: ${(totalBaseSalary - totalFinalSalary).toFixed(2)}₪\n\n`;
    emailBody += `בברכה,\nמערכת ניהול הבניין`;

    // Create Gmail compose URL instead of mailto
    const gmailUrl = `https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${encodeURIComponent(accountantEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open Gmail compose window
    window.open(gmailUrl, '_blank');
  };

  // Generate year options (current year ± 2)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear - 2; year <= currentYear + 1; year++) {
    yearOptions.push(year);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UserCheck className="h-6 w-6 text-green-600" />
          ניהול עובדים
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAccountantEmailModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="h-4 w-4" />
            הגדר מייל רואה חשבון
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            הוסף עובד
          </button>
        </div>
      </div>

      {accountantEmail && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              מייל רואה חשבון: <span className="font-medium">{accountantEmail}</span>
            </span>
          </div>
        </div>
      )}

      {/* Month/Year Selection and Email Button */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-gray-900">בחירת חודש לדוח שכר:</span>
            
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {MONTHS.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSendEmailToAccountant}
              disabled={!accountantEmail}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              title={!accountantEmail ? 'אנא הגדר תחילה את כתובת המייל של רואה החשבון' : 'שלח סיכום שכר לרואה חשבון'}
            >
              <Send className="h-4 w-4" />
              שליחת מייל לרואה חשבון
            </button>
          </div>
        </div>

        {/* Gmail information */}
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ <strong>שיפור:</strong> הכפתור יפתח ישירות את Gmail עם כל הפרטים מוכנים לשליחה. אם אתה לא מחובר לחשבון Google, תתבקש להתחבר תחילה.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onEdit={handleEditEmployee}
            onDelete={onDeleteEmployee}
            onUpdate={onUpdateEmployee}
          />
        ))}
      </div>

      {employees.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">אין עובדים רשומים במערכת</p>
        </div>
      )}

      {isModalOpen && (
        <EmployeeModal
          employee={editingEmployee}
          onSave={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
          onClose={handleCloseModal}
        />
      )}

      {isAccountantEmailModalOpen && (
        <AccountantEmailModal
          currentEmail={accountantEmail}
          onSave={handleSaveAccountantEmail}
          onClose={() => setIsAccountantEmailModalOpen(false)}
        />
      )}
    </div>
  );
};