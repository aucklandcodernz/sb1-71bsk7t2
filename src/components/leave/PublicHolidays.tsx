import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { NZ_PUBLIC_HOLIDAYS_2024 } from '../../utils/nzCompliance';
import { format, addDays } from 'date-fns';

interface AlternativeDay {
  originalDate: string;
  alternativeDate: string;
  reason: string;
}

export const PublicHolidays = () => {
  const [alternativeDays, setAlternativeDays] = useState<AlternativeDay[]>([]);
  const [selectedHoliday, setSelectedHoliday] = useState<string | null>(null);
  const [alternativeDate, setAlternativeDate] = useState('');
  const [reason, setReason] = useState('');

  const handleAddAlternativeDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHoliday || !alternativeDate) return;

    setAlternativeDays([
      ...alternativeDays,
      {
        originalDate: selectedHoliday,
        alternativeDate,
        reason,
      },
    ]);

    setSelectedHoliday(null);
    setAlternativeDate('');
    setReason('');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Public Holidays 2024</h2>
        <p className="text-sm text-gray-500 mt-1">
          NZ statutory holidays and alternative days
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Upcoming Holidays
            </h3>
            <div className="space-y-4">
              {NZ_PUBLIC_HOLIDAYS_2024
                .filter(
                  (holiday) => new Date(holiday.date) >= new Date()
                )
                .map((holiday) => (
                  <div
                    key={holiday.date}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{holiday.name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(holiday.date), 'EEEE, MMMM d')}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedHoliday(holiday.date)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Schedule Alternative Day
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Alternative Days
            </h3>
            {alternativeDays.length > 0 ? (
              <div className="space-y-4">
                {alternativeDays.map((day, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-indigo-50"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {NZ_PUBLIC_HOLIDAYS_2024.find(
                            (h) => h.date === day.originalDate
                          )?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Original: {format(new Date(day.originalDate), 'MMM d')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Alternative: {format(new Date(day.alternativeDate), 'MMM d')}
                        </p>
                      </div>
                      <Clock className="text-indigo-600" size={20} />
                    </div>
                    {day.reason && (
                      <p className="mt-2 text-sm text-gray-600">{day.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No alternative days scheduled
              </p>
            )}

            {selectedHoliday && (
              <form onSubmit={handleAddAlternativeDay} className="mt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Alternative Date
                    </label>
                    <input
                      type="date"
                      required
                      value={alternativeDate}
                      onChange={(e) => setAlternativeDate(e.target.value)}
                      className="input-field"
                      min={addDays(new Date(selectedHoliday), 1)
                        .toISOString()
                        .split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reason
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="input-field"
                      placeholder="e.g., Worked on original holiday"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setSelectedHoliday(null)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary flex-1">
                      Schedule
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">NZ Public Holiday Rules:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Double time for working on public holidays</li>
                <li>Alternative holiday (day in lieu) earned</li>
                <li>Must be taken on a mutually agreed date</li>
                <li>Alternative day expires after 12 months</li>
                <li>Mondayisation applies to certain holidays</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};