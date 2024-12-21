import React from 'react';
import { useBlipStore } from '../../store/blipStore';
import { format } from 'date-fns';
import { Clock, MapPin } from 'lucide-react';

interface BlipHistoryProps {
  employeeId: string;
  startDate: string;
  endDate: string;
}

export const BlipHistory = ({ employeeId, startDate, endDate }: BlipHistoryProps) => {
  const sessions = useBlipStore((state) =>
    state.getSessionHistory(employeeId, startDate, endDate)
  );

  const calculateDuration = (session: any) => {
    if (!session.clockOut) return 'Active';
    
    const start = new Date(session.clockIn.time);
    const end = new Date(session.clockOut.time);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Time Tracking History</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clock In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clock Out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Breaks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {format(new Date(session.clockIn.time), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {format(new Date(session.clockIn.time), 'HH:mm:ss')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {session.clockOut
                    ? format(new Date(session.clockOut.time), 'HH:mm:ss')
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {calculateDuration(session)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {session.breaks.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={() => {
                      // Open location in maps
                      const { latitude, longitude } = session.clockIn.location;
                      window.open(
                        `https://www.google.com/maps?q=${latitude},${longitude}`,
                        '_blank'
                      );
                    }}
                  >
                    <MapPin size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sessions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No time tracking history found
          </div>
        )}
      </div>
    </div>
  );
};