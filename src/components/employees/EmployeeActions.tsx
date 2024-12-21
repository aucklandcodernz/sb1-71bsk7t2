// Previous content updated with onSelect prop
import React from 'react';
import { Edit2, Trash2, UserMinus, UserPlus, Clock } from 'lucide-react';
import { Employee } from '../../types';
import { useEmployeeStore } from '../../store/employeeStore';
import toast from 'react-hot-toast';

interface EmployeeActionsProps {
  employee: Employee;
  onTimeTrack: (employeeId: string) => void;
  onSelect: () => void;
}

export const EmployeeActions = ({ employee, onTimeTrack, onSelect }: EmployeeActionsProps) => {
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);
  const removeEmployee = useEmployeeStore((state) => state.removeEmployee);

  const handleStatusChange = (status: Employee['status']) => {
    updateEmployee(employee.id, { status });
    toast.success(`Employee status updated to ${status.replace('_', ' ')}`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to remove this employee?')) {
      removeEmployee(employee.id);
      toast.success('Employee removed successfully');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onTimeTrack(employee.id)}
        className="p-1 hover:bg-gray-100 rounded text-indigo-600"
        title="Time tracking"
      >
        <Clock size={18} />
      </button>
      <button
        onClick={onSelect}
        className="p-1 hover:bg-gray-100 rounded text-blue-600"
        title="View profile"
      >
        <Edit2 size={18} />
      </button>
      {employee.status === 'active' && (
        <button
          onClick={() => handleStatusChange('on_leave')}
          className="p-1 hover:bg-gray-100 rounded text-yellow-600"
          title="Set on leave"
        >
          <UserMinus size={18} />
        </button>
      )}
      {employee.status === 'on_leave' && (
        <button
          onClick={() => handleStatusChange('active')}
          className="p-1 hover:bg-gray-100 rounded text-green-600"
          title="Set as active"
        >
          <UserPlus size={18} />
        </button>
      )}
      <button
        onClick={handleDelete}
        className="p-1 hover:bg-gray-100 rounded text-red-600"
        title="Remove employee"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};