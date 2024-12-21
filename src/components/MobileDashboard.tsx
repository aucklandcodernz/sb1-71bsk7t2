import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Clock,
  FileText,
  BookOpen,
  DollarSign,
  AlertTriangle,
  Settings,
  TrendingUp
} from 'lucide-react';
import { useEmployeeStore } from '../store/employeeStore';
import { useLeaveStore } from '../store/leaveStore';
import { useHealthSafetyStore } from '../store/healthSafetyStore';

export const MobileDashboard = () => {
  const navigate = useNavigate();
  const activeEmployees = useEmployeeStore((state) => state.getActiveEmployees());
  const pendingLeave = useLeaveStore((state) => 
    state.leaveRequests.filter(r => r.status === 'pending')
  );
  const stats = useHealthSafetyStore((state) => state.getStats());

  const quickActions = [
    {
      icon: Users,
      label: 'Employees',
      path: '/employees',
      count: activeEmployees.length,
    },
    {
      icon: Calendar,
      label: 'Leave',
      path: '/leave',
      count: pendingLeave.length,
    },
    {
      icon: Clock,
      label: 'Time',
      path: '/time',
    },
    {
      icon: FileText,
      label: 'Documents',
      path: '/documents',
    },
    {
      icon: BookOpen,
      label: 'Training',
      path: '/training',
    },
    {
      icon: DollarSign,
      label: 'Payroll',
      path: '/payroll',
    },
    {
      icon: AlertTriangle,
      label: 'H&S',
      path: '/health-safety',
      count: stats.openIncidents,
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">KiwiHR</h1>
        <p className="text-gray-500">Welcome back</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Staff</p>
              <p className="text-2xl font-bold mt-1">{activeEmployees.length}</p>
            </div>
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Users className="text-indigo-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Leave</p>
              <p className="text-2xl font-bold mt-1">{pendingLeave.length}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Calendar className="text-yellow-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className="bg-white rounded-lg shadow p-4 text-center hover:bg-gray-50"
          >
            <div className="flex flex-col items-center">
              <div className="bg-indigo-100 p-3 rounded-lg mb-2">
                <action.icon className="text-indigo-600" size={24} />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
              {action.count !== undefined && (
                <span className="text-xs text-gray-500 mt-1">
                  {action.count} {action.count === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {stats.openIncidents > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="text-red-600 mt-0.5 mr-2" size={16} />
            <div>
              <h4 className="text-sm font-medium text-red-800">
                Open Health & Safety Incidents
              </h4>
              <p className="text-sm text-red-700 mt-1">
                {stats.openIncidents} incident{stats.openIncidents !== 1 && 's'} require{stats.openIncidents === 1 && 's'} attention
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};