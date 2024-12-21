import React from 'react';
import { useRosterStore } from '../../store/rosterStore';
import { Users, Clock, Calendar, TrendingUp } from 'lucide-react';

export const RosterStats = () => {
  const { shifts, weeks } = useRosterStore();
  
  const currentWeek = weeks[weeks.length - 1];
  const activeShifts = shifts.filter(s => s.status === 'scheduled');
  
  const totalHours = activeShifts.reduce((sum, shift) => {
    const start = new Date(shift.startTime);
    const end = new Date(shift.endTime);
    return sum + ((end.getTime() - start.getTime()) / (1000 * 60 * 60));
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Active Shifts</p>
            <p className="text-2xl font-bold mt-1">{activeShifts.length}</p>
          </div>
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Calendar className="text-indigo-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Hours</p>
            <p className="text-2xl font-bold mt-1">{totalHours.toFixed(1)}h</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <Clock className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Employees Scheduled</p>
            <p className="text-2xl font-bold mt-1">
              {new Set(shifts.map(s => s.employeeId)).size}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Users className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Average Hours/Week</p>
            <p className="text-2xl font-bold mt-1">
              {(totalHours / Math.max(weeks.length, 1)).toFixed(1)}h
            </p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <TrendingUp className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};