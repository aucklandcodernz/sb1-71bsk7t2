import React, { useState } from 'react';
import { Calendar, FileText, Bell } from 'lucide-react';
import { useComplianceStore } from '../../store/complianceStore';
import { useDocumentStore } from '../../store/documentStore';

interface ComplianceFormProps {
  onClose: () => void;
}

export const ComplianceForm = ({ onClose }: ComplianceFormProps) => {
  const addItem = useComplianceStore((state) => state.addItem);
  const documents = useDocumentStore((state) => state.documents);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    type: 'routine' as const,
    assignee: '',
    reminderDays: [7, 3, 1],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItem({
      ...formData,
      status: 'pending',
      documentIds: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-6">Add Compliance Requirement</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="input-field"
            >
              <option value="routine">Routine</option>
              <option value="important">Important</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              required
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assignee</label>
            <input
              type="text"
              required
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reminders (days before)</label>
            <div className="flex items-center space-x-2">
              {formData.reminderDays.map((days, index) => (
                <span
                  key={days}
                  className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                >
                  {days} days
                </span>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Add Requirement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};