import React, { useState } from 'react';
import { useRosterStore } from '../../store/rosterStore';
import { Plus, X } from 'lucide-react';

interface ShiftPatternFormProps {
  onClose: () => void;
}

export const ShiftPatternForm = ({ onClose }: ShiftPatternFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    pattern: [
      {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
        breakDuration: 60,
      },
    ],
  });

  const addPattern = useRosterStore((state) => state.addPattern);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPattern(formData);
    onClose();
  };

  const addShift = () => {
    setFormData({
      ...formData,
      pattern: [
        ...formData.pattern,
        {
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '17:00',
          breakDuration: 60,
        },
      ],
    });
  };

  const updateShift = (index: number, field: string, value: any) => {
    const newPattern = [...formData.pattern];
    newPattern[index] = { ...newPattern[index], [field]: value };
    setFormData({ ...formData, pattern: newPattern });
  };

  const removeShift = (index: number) => {
    setFormData({
      ...formData,
      pattern: formData.pattern.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Shift Pattern</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pattern Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g., Standard Week"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shifts
            </label>
            <div className="space-y-4">
              {formData.pattern.map((shift, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Day
                      </label>
                      <select
                        value={shift.dayOfWeek}
                        onChange={(e) =>
                          updateShift(index, 'dayOfWeek', parseInt(e.target.value))
                        }
                        className="input-field"
                      >
                        <option value={0}>Sunday</option>
                        <option value={1}>Monday</option>
                        <option value={2}>Tuesday</option>
                        <option value={3}>Wednesday</option>
                        <option value={4}>Thursday</option>
                        <option value={5}>Friday</option>
                        <option value={6}>Saturday</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Break (minutes)
                      </label>
                      <input
                        type="number"
                        value={shift.breakDuration}
                        onChange={(e) =>
                          updateShift(index, 'breakDuration', parseInt(e.target.value))
                        }
                        className="input-field"
                        min="0"
                        max="120"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={shift.startTime}
                        onChange={(e) =>
                          updateShift(index, 'startTime', e.target.value)
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={shift.endTime}
                        onChange={(e) =>
                          updateShift(index, 'endTime', e.target.value)
                        }
                        className="input-field"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeShift(index)}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Shift
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addShift}
              className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Add Shift
            </button>
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Create Pattern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};