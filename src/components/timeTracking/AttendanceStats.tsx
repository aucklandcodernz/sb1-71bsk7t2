import React from 'react';
import { useTimeTrackingStore } from '../../store/timeTrackingStore';
import { Clock, TrendingUp, AlertCircle, Users } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';

interface AttendanceStatsProps {
  employeeId?: string;
}

export const AttendanceStats = ({ employeeId }: AttendanceStatsProps) => {
  const calculateHours = useTimeTrackingStore((state) => state.calculateHours);
  const getActiveEntry = useTimeTrackingStore((state) => state.getActiveEntry);

  const weekStart = startOfWeek(new Date()).toISOString();
  const weekEnd = endOfWeek(new Date()).toISOString();
  const hours = calculateHours(employeeId || 'all', weekStart, weekEnd);

  const isActive = employeeId ? !!getActiveEntry(employeeId) : false;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Regular Hours</p>
            <p className="text-2xl font-bold mt-1">
              {hours.regular.toFixed(1)}h
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Clock className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Overtime</p>
            <p className="text-2xl font-bold mt-1">
              {hours.overtime.toFixed(1)}h
            </p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <TrendingUp className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <p className="text-2xl font-bold mt-1">
              {isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className={`${
            isActive ? 'bg-green-100' : 'bg-gray-100'
          } p-3 rounded-lg`}>
            <AlertCircle className={`${
              isActive ? 'text-green-600' : 'text-gray-600'
            }`} size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Week Total</p>
            <p className="text-2xl font-bold mt-1">
              {(hours.regular + hours.overtime).toFixed(1)}h
            </p>
          </div>
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Users className="text-indigo-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};