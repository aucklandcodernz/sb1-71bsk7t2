import React, { useState } from 'react';
import { useEmployeeStore } from '../../store/employeeStore';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface InductionFormProps {
  employeeId: string;
  onClose: () => void;
}

export const InductionForm = ({ employeeId, onClose }: InductionFormProps) => {
  const employee = useEmployeeStore((state) => state.getEmployeeById(employeeId));
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);

  const defaultInductionItems = [
    { id: '1', name: 'Health & Safety Induction', status: 'pending' },
    { id: '2', name: 'Company Policies Review', status: 'pending' },
    { id: '3', name: 'IT Systems Training', status: 'pending' },
    { id: '4', name: 'Team Introduction', status: 'pending' },
    { id: '5', name: 'Role-specific Training', status: 'pending' },
    { id: '6', name: 'Emergency Procedures', status: 'pending' },
  ];

  const [formData, setFormData] = useState({
    induction: employee?.induction || {
      completed: false,
      completionDate: '',
      items: defaultInductionItems
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const allCompleted = formData.induction.items.every(
        item => item.status === 'completed'
      );
      
      await updateEmployee(employeeId, {
        induction: {
          ...formData.induction,
          completed: allCompleted,
          completionDate: allCompleted ? new Date().toISOString() : undefined
        }
      });
      
      toast.success('Induction status updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update induction status');
    }
  };

  const updateItemStatus = (id: string, status: 'pending' | 'completed', verifiedBy?: string) => {
    setFormData(prev => ({
      ...prev,
      induction: {
        ...prev.induction,
        items: prev.induction.items.map(item =>
          item.id === id
            ? {
                ...item,
                status,
                completionDate: status === 'completed' ? new Date().toISOString() : undefined,
                verifiedBy
              }
            : item
        )
      }
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-6">Employee Induction</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {formData.induction.items.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-lg ${
                item.status === 'completed' ? 'bg-green-50 border-green-200' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.status === 'completed'}
                    onChange={(e) => updateItemStatus(
                      item.id,
                      e.target.checked ? 'completed' : 'pending',
                      e.target.checked ? 'Current User' : undefined
                    )}
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                  />
                  <span className="ml-3 font-medium">{item.name}</span>
                </div>
                {item.status === 'completed' && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle size={16} className="mr-1" />
                    Completed
                  </div>
                )}
              </div>
              {item.completionDate && (
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Clock size={14} className="mr-1" />
                  Completed on: {format(new Date(item.completionDate), 'dd/MM/yyyy')}
                  {item.verifiedBy && (
                    <span className="ml-2">by {item.verifiedBy}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Induction Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Complete all mandatory training modules</li>
                <li>Review and acknowledge company policies</li>
                <li>Complete health and safety induction</li>
                <li>Verify understanding of role responsibilities</li>
                <li>Document completion of all items</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};