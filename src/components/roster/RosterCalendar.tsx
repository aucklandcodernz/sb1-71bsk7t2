import React from 'react';
import { useRosterStore } from '../../store/rosterStore';
import { format, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RosterCalendarProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
}

export const RosterCalendar = ({ selectedWeek, onWeekChange }: RosterCalendarProps) => {
  const { shifts } = useRosterStore();

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(selectedWeek, i));

  const getShiftsForDay = (date: Date) => {
    return shifts.filter((shift) => isSameDay(new Date(shift.startTime), date));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onWeekChange(addDays(selectedWeek, -7))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold">
            Week of {format(selectedWeek, 'MMM d, yyyy')}
          </h2>
          <button
            onClick={() => onWeekChange(addDays(selectedWeek, 7))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="bg-white">
            <div className="p-2 border-b text-center">
              <div className="font-medium">{format(day, 'EEE')}</div>
              <div className="text-sm text-gray-500">{format(day, 'd')}</div>
            </div>
            <div className="min-h-[150px] p-2">
              {getShiftsForDay(day).map((shift) => (
                <div
                  key={shift.id}
                  className="mb-2 p-2 bg-indigo-50 rounded text-sm"
                >
                  <div className="font-medium">
                    {format(new Date(shift.startTime), 'HH:mm')} -{' '}
                    {format(new Date(shift.endTime), 'HH:mm')}
                  </div>
                  <div className="text-gray-600">{shift.employeeId}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};