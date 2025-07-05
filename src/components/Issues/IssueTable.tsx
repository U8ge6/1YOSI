import React from 'react';
import { Edit2, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Issue } from '../../types';

interface IssueTableProps {
  issues: Issue[];
  onEditIssue: (issue: Issue) => void;
  onDeleteIssue: (issueId: string) => void;
  onQuickStatusChange: (issue: Issue) => void;
}

export const IssueTable: React.FC<IssueTableProps> = ({
  issues,
  onEditIssue,
  onDeleteIssue,
  onQuickStatusChange
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'פתוח';
      case 'in-progress':
        return 'בטיפול';
      case 'resolved':
        return 'טופל';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const sortedIssues = [...issues].sort((a, b) => {
    // Sort by status priority (open > in-progress > resolved) then by date
    const statusPriority = { 'open': 3, 'in-progress': 2, 'resolved': 1 };
    const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 0;
    const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 0;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-right font-medium text-gray-700">תאריך דיווח</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">מדווח</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">תיאור התקלה</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">כניסה</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">עלות תיקון</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">סטטוס</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">הערות</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">פעולות</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedIssues.map((issue) => (
            <tr key={issue.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-600">
                {new Date(issue.date).toLocaleDateString('he-IL')}
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">
                {issue.reporterName}
              </td>
              <td className="px-4 py-3 text-gray-900">
                {issue.description}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {issue.entrance ? `כניסה ${issue.entrance}` : 'כל הבניין'}
              </td>
              <td className="px-4 py-3">
                {issue.repairCost ? (
                  <span className="font-medium text-gray-900">
                    {issue.repairCost.toLocaleString()}₪
                  </span>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onQuickStatusChange(issue)}
                  className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors cursor-pointer ${getStatusColor(issue.status)}`}
                  title="לחץ לשינוי סטטוס"
                >
                  {getStatusIcon(issue.status)}
                  <span className="text-xs font-medium">
                    {getStatusLabel(issue.status)}
                  </span>
                </button>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {issue.notes || '-'}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditIssue(issue)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title="ערוך"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteIssue(issue.id)}
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
      
      {issues.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          אין תקלות רשומות
        </div>
      )}
    </div>
  );
};