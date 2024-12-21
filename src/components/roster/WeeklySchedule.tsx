import React from 'react';
import { useRosterStore } from '../../store/rosterStore';
import { format, addDays, startOfWeek } from 'date-fns';
import { Clock } from 'lucide-react';

interface WeeklyScheduleProps {
  weekStart: Date;
}

export const WeeklySchedule = ({ weekStart }: WeeklyScheduleProps) => {
  const { shifts } = useRosterStore();

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getShiftsForDay = (date: Date) => {
    return shifts.filter(
      (shift) =>
        format(new Date(shift.startTime), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Weekly Schedule</h2>
        <p className="text-sm text-gray-500">
          Week of {format(weekStart, 'MMMM d, yyyy')}
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="text-center">
              <div className="font-medium">{format(day, 'EEE')}</div>
              <div className="text-sm text-gray-500">{format(day, 'd')}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dayShifts = getShiftsForDay(day);
            return (
              <div key={day.toISOString()} className="min-h-[100px]">
                {dayShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="mb-2 p-2 bg-indigo-50 rounded text-sm"
                  >
                    <div className="flex items-center text-indigo-600">
                      <Clock className="w-3 h-3 mr-1" />
                      {format(new Date(shift.startTime), 'HH:mm')} -{' '}
                      {format(new Date(shift.endTime), 'HH:mm')}
                    </div>
                    {shift.employeeId && (
                      <div className="text-gray-600 mt-1 text-xs">
                        {shift.employeeId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};