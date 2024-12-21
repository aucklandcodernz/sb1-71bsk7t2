import React from 'react';

interface PayDetailsProps {
  hourlyRate: number;
  setHourlyRate: (rate: number) => void;
  hours: {
    regular: number;
    overtime: number;
    publicHoliday: number;
  };
  errors: Record<string, string>;
}

export const PayDetails = ({ hourlyRate, setHourlyRate, hours, errors }: PayDetailsProps) => {
  const totalHours = hours.regular + hours.overtime + hours.publicHoliday;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h4 className="font-medium mb-4">Pay Details</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hourly Rate
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
              className={`input-field pl-7 ${errors.hourlyRate ? 'border-red-500' : ''}`}
              min="22.70"
              step="0.01"
            />
          </div>
          {errors.hourlyRate && (
            <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500">Regular Hours</label>
            <p className="text-lg font-medium">{hours.regular.toFixed(2)}h</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500">Overtime Hours</label>
            <p className="text-lg font-medium">{hours.overtime.toFixed(2)}h</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500">Public Holiday Hours</label>
            <p className="text-lg font-medium">{hours.publicHoliday.toFixed(2)}h</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500">Total Hours</label>
            <p className="text-lg font-medium">{totalHours.toFixed(2)}h</p>
          </div>
        </div>
      </div>
    </div>
  );
};