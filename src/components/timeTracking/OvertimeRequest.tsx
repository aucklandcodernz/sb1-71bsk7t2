import React, { useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface OvertimeRequestProps {
  onSubmit: (data: {
    date: string;
    hours: number;
    reason: string;
  }) => void;
}

export const OvertimeRequest = ({ onSubmit }: OvertimeRequestProps) => {
  const [formData, setFormData] = useState({
    date: '',
    hours: 1,
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // NZ overtime rules validation
    if (formData.hours > 4) {
      toast.error('Maximum overtime request is 4 hours per day');
      return;
    }

    onSubmit(formData);
    toast.success('Overtime request submitted successfully');
    setFormData({
      date: '',
      hours: 1,
      reason: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Request Overtime</h3>
        <Clock className="text-gray-400" size={24} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="input-field"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hours Required
          </label>
          <input
            type="number"
            required
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
            className="input-field"
            min="1"
            max="4"
            step="0.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reason</label>
          <textarea
            required
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="input-field"
            rows={3}
            placeholder="Explain why overtime is needed"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="text-yellow-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-yellow-700">
              <p className="font-medium mb-1">NZ Overtime Rates:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Time and a half for first 3 hours</li>
                <li>Double time after 3 hours</li>
                <li>Double time on public holidays</li>
                <li>Alternative holiday earned for public holidays</li>
              </ul>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          Submit Request
        </button>
      </form>
    </div>
  );
};