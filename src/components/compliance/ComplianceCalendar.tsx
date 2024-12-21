import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useComplianceStore } from '../../store/complianceStore';
import { parseISO, isSameDay, format } from 'date-fns';
import { AlertCircle, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';

export const ComplianceCalendar = () => {
  const items = useComplianceStore((state) => state.items);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const deadlinesForDay = items.filter((item) =>
      isSameDay(parseISO(item.deadline), date)
    );

    if (deadlinesForDay.length === 0) return null;

    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <div className={`h-1.5 w-1.5 rounded-full ${
          deadlinesForDay.some((item) => item.type === 'critical')
            ? 'bg-red-500'
            : deadlinesForDay.some((item) => item.type === 'important')
            ? 'bg-yellow-500'
            : 'bg-green-500'
        }`} />
      </div>
    );
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const hasDeadlines = items.some((item) =>
      isSameDay(parseISO(item.deadline), date)
    );
    return hasDeadlines ? 'font-bold' : '';
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const getItemsForDate = (date: Date) => {
    return items.filter((item) => isSameDay(parseISO(item.deadline), date));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <CalendarIcon className="mr-2" size={20} />
        Compliance Calendar
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={tileContent}
          tileClassName={tileClassName}
          className="rounded-lg border-0 shadow-sm"
        />

        <div>
          {selectedDate ? (
            <div>
              <h3 className="font-medium mb-4">
                Requirements for {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              <div className="space-y-4">
                {getItemsForDate(selectedDate).map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border ${
                      item.type === 'critical'
                        ? 'border-red-200 bg-red-50'
                        : item.type === 'important'
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start">
                      {item.status === 'completed' ? (
                        <CheckCircle className="text-green-500 mt-1 mr-2" size={16} />
                      ) : (
                        <AlertCircle
                          className={`mt-1 mr-2 ${
                            item.type === 'critical'
                              ? 'text-red-500'
                              : item.type === 'important'
                              ? 'text-yellow-500'
                              : 'text-green-500'
                          }`}
                          size={16}
                        />
                      )}
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Assigned to: {item.assignee}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : item.status === 'in_progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {getItemsForDate(selectedDate).length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No compliance requirements for this date
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a date to view requirements
            </div>
          )}
        </div>
      </div>
    </div>
  );
};