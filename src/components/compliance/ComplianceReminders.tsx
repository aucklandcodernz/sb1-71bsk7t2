import React from 'react';
import { useComplianceStore } from '../../store/complianceStore';
import { Bell, Calendar, AlertCircle } from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';

export const ComplianceReminders = () => {
  const upcomingDeadlines = useComplianceStore((state) => state.getUpcomingDeadlines());

  const getPriorityColor = (deadline: string, type: string) => {
    const daysUntil = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (type === 'critical') return 'text-red-600 bg-red-100';
    if (daysUntil <= 7) return 'text-orange-600 bg-orange-100';
    if (daysUntil <= 14) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
          <Bell className="text-gray-400" size={24} />
        </div>
      </div>

      <div className="p-6">
        {upcomingDeadlines.length > 0 ? (
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="flex items-start space-x-4 p-4 border rounded-lg"
              >
                <div
                  className={`p-2 rounded-lg ${getPriorityColor(
                    deadline.deadline,
                    deadline.type
                  )}`}
                >
                  <AlertCircle size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{deadline.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {deadline.description}
                  </p>
                  <div className="flex items-center mt-2 text-sm">
                    <Calendar size={14} className="text-gray-400 mr-1" />
                    <span className="text-gray-500">
                      Due: {format(new Date(deadline.deadline), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    deadline.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : deadline.status === 'in_progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {deadline.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No upcoming compliance deadlines
          </div>
        )}
      </div>
    </div>
  );
};