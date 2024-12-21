import React from 'react';
import { useComplianceStore } from '../../store/complianceStore';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';

export const ComplianceStats = () => {
  const stats = useComplianceStore((state) => state.getStats());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold mt-1">{stats.completed}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-2xl font-bold mt-1">{stats.inProgress}</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <Clock className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Overdue</p>
            <p className="text-2xl font-bold mt-1">{stats.overdue}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-lg">
            <AlertCircle className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Upcoming</p>
            <p className="text-2xl font-bold mt-1">{stats.upcoming}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Calendar className="text-blue-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};