import React, { useState } from 'react';
import { useTimeTrackingStore } from '../../store/timeTrackingStore';
import { Clock, Plus, AlertCircle } from 'lucide-react';
import { format, isAfter, isBefore, addHours } from 'date-fns';
import toast from 'react-hot-toast';

interface ManualTimeEntryProps {
  employeeId: string;
  onClose?: () => void;
}

export const ManualTimeEntry = ({ employeeId, onClose }: ManualTimeEntryProps) => {
  const addEntry = useTimeTrackingStore((state) => state.addEntry);
  
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    clockIn: '09:00',
    clockOut: '17:00',
    breakDuration: 60,
    type: 'regular' as const,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEntry = () => {
    const newErrors: Record<string, string> = {};
    const clockInTime = new Date(`${formData.date}T${formData.clockIn}`);
    const clockOutTime = new Date(`${formData.date}T${formData.clockOut}`);

    if (isAfter(clockInTime, new Date())) {
      newErrors.clockIn = 'Cannot clock in in the future';
    }

    if (isAfter(clockOutTime, addHours(new Date(), 1))) {
      newErrors.clockOut = 'Cannot clock out more than 1 hour in the future';
    }

    if (isBefore(clockOutTime, clockInTime)) {
      newErrors.clockOut = 'Clock out must be after clock in';
    }

    const hours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
    if (hours > 24) {
      newErrors.clockOut = 'Shift cannot be longer than 24 hours';
    }

    if (formData.breakDuration < 0) {
      newErrors.breakDuration = 'Break duration cannot be negative';
    }

    if (formData.breakDuration > hours * 60) {
      newErrors.breakDuration = 'Break duration cannot exceed shift length';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEntry()) {
      return;
    }

    try {
      const clockInTime = new Date(`${formData.date}T${formData.clockIn}`);
      const clockOutTime = new Date(`${formData.date}T${formData.clockOut}`);

      addEntry({
        employeeId,
        clockIn: clockInTime.toISOString(),
        clockOut: clockOutTime.toISOString(),
        type: formData.type,
        notes: formData.notes,
        breakDuration: formData.breakDuration,
        location: {
          latitude: -36.8485,  // Default to Auckland CBD for manual entries
          longitude: 174.7633,
        }
      });

      toast.success('Time entry added successfully');
      onClose?.();
    } catch (error) {
      toast.error('Failed to add time entry');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Manual Time Entry</h2>
          <p className="text-sm text-gray-500">Add or adjust time records</p>
        </div>
        <Clock className="text-gray-400" size={24} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="input-field"
            required
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Clock In</label>
            <input
              type="time"
              value={formData.clockIn}
              onChange={(e) => setFormData({ ...formData, clockIn: e.target.value })}
              className="input-field"
              required
            />
            {errors.clockIn && (
              <p className="mt-1 text-sm text-red-600">{errors.clockIn}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Clock Out</label>
            <input
              type="time"
              value={formData.clockOut}
              onChange={(e) => setFormData({ ...formData, clockOut: e.target.value })}
              className="input-field"
              required
            />
            {errors.clockOut && (
              <p className="mt-1 text-sm text-red-600">{errors.clockOut}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Break Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.breakDuration}
              onChange={(e) => setFormData({ ...formData, breakDuration: parseInt(e.target.value) })}
              className="input-field"
              min="0"
              step="15"
              required
            />
            {errors.breakDuration && (
              <p className="mt-1 text-sm text-red-600">{errors.breakDuration}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="input-field"
              required
            >
              <option value="regular">Regular</option>
              <option value="overtime">Overtime</option>
              <option value="public_holiday">Public Holiday</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="input-field"
            rows={3}
            placeholder="Add any relevant notes..."
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">NZ Employment Law:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Minimum 30-minute meal break after 4 hours</li>
                <li>Two 10-minute paid rest breaks in 8-hour day</li>
                <li>Time and a half for overtime (first 3 hours)</li>
                <li>Double time for subsequent overtime hours</li>
                <li>Double time plus alternative holiday for public holidays</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Entry</span>
          </button>
        </div>
      </form>
    </div>
  );
};