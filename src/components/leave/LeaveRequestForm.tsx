import React, { useState } from 'react';
import { useLeaveStore } from '../../store/leaveStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { Calendar, AlertCircle } from 'lucide-react';
import {
  validateLeaveRequest,
  calculateWorkingDays,
  calculateLeaveBalance,
} from '../../utils/leaveUtils';
import toast from 'react-hot-toast';

interface LeaveRequestFormProps {
  onClose: () => void;
}

export const LeaveRequestForm = ({ onClose }: LeaveRequestFormProps) => {
  const [formData, setFormData] = useState({
    type: 'annual' as const,
    startDate: '',
    endDate: '',
    reason: '',
    medicalCertificate: false,
  });

  const addLeaveRequest = useLeaveStore((state) => state.addLeaveRequest);
  const calculateLeaveBalance = useLeaveStore((state) => state.calculateLeaveBalance);
  const currentEmployee = useEmployeeStore((state) => state.getEmployeeById('current-user'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const balance = calculateLeaveBalance('current-user', startDate);

    const validation = validateLeaveRequest(
      startDate,
      endDate,
      formData.type,
      balance
    );

    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    // Check medical certificate requirement for sick leave
    if (
      formData.type === 'sick' &&
      calculateWorkingDays(startDate, endDate) >= 3 &&
      !formData.medicalCertificate
    ) {
      toast.error('Medical certificate required for sick leave of 3 or more days');
      return;
    }

    addLeaveRequest({
      employeeId: 'current-user',
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'pending',
      reason: formData.reason,
    });

    toast.success('Leave request submitted successfully');
    onClose();
  };

  const workingDays = formData.startDate && formData.endDate
    ? calculateWorkingDays(new Date(formData.startDate), new Date(formData.endDate))
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Request Leave</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="input-field"
            >
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="bereavement">Bereavement Leave</option>
              <option value="family_violence">Family Violence Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate}
                className="input-field"
              />
            </div>
          </div>

          {workingDays > 0 && (
            <div className="text-sm text-gray-600">
              Working days: {workingDays}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Provide details about your leave request"
            />
          </div>

          {formData.type === 'sick' && workingDays >= 3 && (
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.medicalCertificate}
                  onChange={(e) =>
                    setFormData({ ...formData, medicalCertificate: e.target.checked })
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  I have a medical certificate
                </span>
              </label>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex">
              <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">NZ Leave Entitlements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>4 weeks annual leave after 12 months</li>
                  <li>10 days sick leave after 6 months</li>
                  <li>3 days bereavement leave</li>
                  <li>10 days family violence leave</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};