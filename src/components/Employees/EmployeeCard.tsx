import React, { useState } from 'react';
import { Edit2, Trash2, Phone, Calendar, Plus, Minus } from 'lucide-react';
import { Employee } from '../../types';

interface EmployeeCardProps {
  employee: Employee;
  selectedMonth: number;
  selectedYear: number;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  onUpdate: (employee: Employee) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  selectedMonth,
  selectedYear,
  onEdit,
  onDelete,
  onUpdate
}) => {
  const [newAbsence, setNewAbsence] = useState({ date: '', reason: '' });

  // Use current month for real-time absence management
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  // Filter absences for the selected month (for salary calculation display)
  const selectedMonthAbsences = employee.absences.filter(absence => {
    const absenceDate = new Date(absence.date);
    return absenceDate.getMonth() + 1 === selectedMonth && absenceDate.getFullYear() === selectedYear;
  });

  // Filter absences for current month (for absence management)
  const currentMonthAbsences = employee.absences.filter(absence => {
    const absenceDate = new Date(absence.date);
    return absenceDate.getMonth() + 1 === currentMonth && absenceDate.getFullYear() === currentYear;
  });

  const dailyWage = employee.baseSalary / employee.workDaysPerMonth;
  const selectedMonthDeduction = selectedMonthAbsences.length * dailyWage;
  const selectedMonthSalary = employee.baseSalary - selectedMonthDeduction;

  const handleAddAbsence = () => {
    if (!newAbsence.date || !newAbsence.reason) return;
    
    const updatedEmployee = {
      ...employee,
      absences: [
        ...employee.absences,
        {
          id: `abs-${Date.now()}`,
          date: newAbsence.date,
          reason: newAbsence.reason
        }
      ]
    };
    
    onUpdate(updatedEmployee);
    setNewAbsence({ date: '', reason: '' });
  };

  const handleRemoveAbsence = (absenceId: string) => {
    const updatedEmployee = {
      ...employee,
      absences: employee.absences.filter(a => a.id !== absenceId)
    };
    onUpdate(updatedEmployee);
  };

  const handleCall = () => {
    window.open(`tel:${employee.phone}`, '_blank');
  };

  // Check if employee was working during the selected month
  const employeeStartDate = new Date(employee.startDate);
  const lastDayOfSelectedMonth = new Date(selectedYear, selectedMonth, 0);
  const wasWorkingInSelectedMonth = employeeStartDate <= lastDayOfSelectedMonth;

  const MONTHS = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Phone className="h-4 w-4" />
            <button
              onClick={handleCall}
              className="hover:text-blue-600 transition-colors"
            >
              {employee.phone}
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Calendar className="h-4 w-4" />
            <span>החל מ: {new Date(employee.startDate).toLocaleDateString('he-IL')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(employee)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
            title="ערוך"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(employee.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
            title="מחק"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Salary Calculator for Selected Month */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-900 mb-3">
          מחשבון שכר - {MONTHS[selectedMonth - 1]} {selectedYear}
        </h4>
        
        {!wasWorkingInSelectedMonth ? (
          <div className="text-center py-4">
            <p className="text-orange-600 font-medium">
              העובד לא עבד בחודש זה
            </p>
            <p className="text-sm text-gray-600 mt-1">
              תאריך תחילת עבודה: {new Date(employee.startDate).toLocaleDateString('he-IL')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">שכר בסיס:</span>
              <div className="font-medium">{employee.baseSalary.toLocaleString()}₪</div>
            </div>
            <div>
              <span className="text-gray-600">ימי עבודה בחודש:</span>
              <div className="font-medium">{employee.workDaysPerMonth}</div>
            </div>
            <div>
              <span className="text-gray-600">שווי יום עבודה:</span>
              <div className="font-medium">{dailyWage.toFixed(2)}₪</div>
            </div>
            <div>
              <span className="text-gray-600">היעדרויות החודש:</span>
              <div className="font-medium text-red-600">{selectedMonthAbsences.length} ימים</div>
            </div>
            <div>
              <span className="text-gray-600">ניכוי כולל:</span>
              <div className="font-medium text-red-600">{selectedMonthDeduction.toFixed(2)}₪</div>
            </div>
            <div className="bg-blue-100 rounded p-2">
              <span className="text-blue-800 font-medium">שכר סופי:</span>
              <div className="font-bold text-blue-900">{selectedMonthSalary.toFixed(2)}₪</div>
            </div>
          </div>
        )}
      </div>

      {/* Absences Management - Always for current month */}
      <div className="border-t border-gray-200 pt-4">
        <h5 className="font-medium text-gray-900 mb-3">
          ניהול היעדרויות - {MONTHS[currentMonth - 1]} {currentYear}
        </h5>
        
        {/* Add new absence */}
        <div className="flex gap-2 mb-3">
          <input
            type="date"
            value={newAbsence.date}
            onChange={(e) => setNewAbsence(prev => ({ ...prev, date: e.target.value }))}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
          />
          <input
            type="text"
            value={newAbsence.reason}
            onChange={(e) => setNewAbsence(prev => ({ ...prev, reason: e.target.value }))}
            placeholder="סיבה"
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
          />
          <button
            onClick={handleAddAbsence}
            disabled={!newAbsence.date || !newAbsence.reason}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Current month absences */}
        <div className="space-y-2">
          {currentMonthAbsences.map((absence) => (
            <div key={absence.id} className="flex items-center justify-between bg-red-50 rounded p-2 text-sm">
              <div>
                <span className="font-medium">{new Date(absence.date).toLocaleDateString('he-IL')}</span>
                <span className="text-gray-600 mr-2">- {absence.reason}</span>
              </div>
              <button
                onClick={() => handleRemoveAbsence(absence.id)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
                title="הסר"
              >
                <Minus className="h-3 w-3" />
              </button>
            </div>
          ))}
          {currentMonthAbsences.length === 0 && (
            <p className="text-sm text-gray-500">אין היעדרויות החודש</p>
          )}
        </div>
      </div>
    </div>
  );
};