import React, { useState } from 'react';
import { Plus, Filter, AlertTriangle } from 'lucide-react';
import { IssueTable } from './IssueTable';
import { IssueModal } from './IssueModal';
import { QuickStatusModal } from './QuickStatusModal';
import { Issue, Building } from '../../types';

interface IssuesProps {
  issues: Issue[];
  building: Building;
  onAddIssue: (issue: Omit<Issue, 'id'>) => void;
  onUpdateIssue: (issue: Issue) => void;
  onDeleteIssue: (issueId: string) => void;
}

export const Issues: React.FC<IssuesProps> = ({
  issues,
  building,
  onAddIssue,
  onUpdateIssue,
  onDeleteIssue
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterEntrance, setFilterEntrance] = useState<string>('all');
  
  // State for quick status change modal
  const [isQuickStatusModalOpen, setIsQuickStatusModalOpen] = useState(false);
  const [quickStatusIssue, setQuickStatusIssue] = useState<Issue | null>(null);

  const filteredIssues = issues.filter(i => {
    const statusMatch = filterStatus === 'all' || i.status === filterStatus;
    const entranceMatch = filterEntrance === 'all' || 
      (filterEntrance === 'building' && !i.entrance) ||
      i.entrance === filterEntrance;
    return statusMatch && entranceMatch;
  });

  const openIssues = issues.filter(i => i.status !== 'resolved').length;
  const totalRepairCost = issues
    .filter(i => i.status === 'resolved' && i.repairCost)
    .reduce((sum, i) => sum + (i.repairCost || 0), 0);

  const handleAddIssue = (issueData: Omit<Issue, 'id'>) => {
    onAddIssue(issueData);
    setIsModalOpen(false);
  };

  const handleEditIssue = (issue: Issue) => {
    setEditingIssue(issue);
    setIsModalOpen(true);
  };

  const handleUpdateIssue = (issueData: Omit<Issue, 'id'>) => {
    if (editingIssue) {
      onUpdateIssue({ ...issueData, id: editingIssue.id });
      setEditingIssue(null);
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIssue(null);
  };

  // Handler for quick status change
  const handleQuickStatusChange = (issue: Issue) => {
    setQuickStatusIssue(issue);
    setIsQuickStatusModalOpen(true);
  };

  // Close handler for quick status change modal
  const handleCloseQuickStatusModal = () => {
    setIsQuickStatusModalOpen(false);
    setQuickStatusIssue(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            תקלות
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
            <span>תקלות פתוחות: <span className="font-medium text-red-600">{openIssues}</span></span>
            <span>עלות תיקונים: <span className="font-medium">{totalRepairCost.toLocaleString()}₪</span></span>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          דווח תקלה
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">כל התקלות</option>
            <option value="open">פתוח</option>
            <option value="in-progress">בטיפול</option>
            <option value="resolved">טופל</option>
          </select>
          
          <select
            value={filterEntrance}
            onChange={(e) => setFilterEntrance(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">כל הכניסות</option>
            <option value="building">כל הבניין</option>
            {building.entrances.map(entrance => (
              <option key={entrance} value={entrance}>כניסה {entrance}</option>
            ))}
          </select>
        </div>

        <IssueTable
          issues={filteredIssues}
          onEditIssue={handleEditIssue}
          onDeleteIssue={onDeleteIssue}
          onQuickStatusChange={handleQuickStatusChange}
        />
      </div>

      {isModalOpen && (
        <IssueModal
          issue={editingIssue}
          building={building}
          onSave={editingIssue ? handleUpdateIssue : handleAddIssue}
          onClose={handleCloseModal}
        />
      )}

      {isQuickStatusModalOpen && quickStatusIssue && (
        <QuickStatusModal
          issue={quickStatusIssue}
          onSave={onUpdateIssue}
          onClose={handleCloseQuickStatusModal}
        />
      )}
    </div>
  );
};