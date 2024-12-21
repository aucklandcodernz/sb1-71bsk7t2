import React, { useState } from 'react';
import { EmployeeList } from '../components/employees/EmployeeList';
import { EmployeeForm } from '../components/employees/EmployeeForm';
import { EmployeeProfile } from '../components/employees/EmployeeProfile';
import { TimeTrackerModal } from '../components/timeTracking/TimeTrackerModal';
import { EmployeeImportExport } from '../components/employees/EmployeeImportExport';
import { UserPlus, Search } from 'lucide-react';
import { useEmployeeStore } from '../store/employeeStore';
import { usePermissions } from '../hooks/usePermissions';

const Employees = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [timeTrackingEmployee, setTimeTrackingEmployee] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    searchQuery: '',
  });

  const { hasPermission } = usePermissions();
  const departments = useEmployeeStore(state => 
    Array.from(new Set(state.employees.map(emp => emp.department)))
  );

  const statuses = ['active', 'on_leave', 'terminated'];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500">Manage your team members</p>
        </div>
        {hasPermission('manage_employees') && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <UserPlus size={20} />
            <span>Add Employee</span>
          </button>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search employees..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            className="input-field pl-10"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          className="input-field"
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="input-field"
        >
          <option value="">All Statuses</option>
          {statuses.map(status => (
            <option key={status} value={status}>
              {status.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>

        {hasPermission('manage_employees') && (
          <EmployeeImportExport />
        )}
      </div>

      <EmployeeList
        filters={filters}
        onTimeTrack={setTimeTrackingEmployee}
        onSelectEmployee={setSelectedEmployee}
      />

      {showAddForm && hasPermission('manage_employees') && (
        <EmployeeForm onClose={() => setShowAddForm(false)} />
      )}

      {selectedEmployee && (
        <EmployeeProfile
          employeeId={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {timeTrackingEmployee && (
        <TimeTrackerModal
          employeeId={timeTrackingEmployee}
          onClose={() => setTimeTrackingEmployee(null)}
        />
      )}
    </div>
  );
};

export default Employees;