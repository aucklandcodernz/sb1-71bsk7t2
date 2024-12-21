import React, { useState } from 'react';
import { useLeaveStore } from '../../store/leaveStore';
import { Calendar, Clock, AlertCircle, Download } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { calculateLeaveBalance, validateLeaveRequest } from '../../utils/leaveUtils';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

interface LeaveManagementTabProps {
  employeeId: string;
}

export const LeaveManagementTab = ({ employeeId }: LeaveManagementTabProps) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'annual' as const,
    startDate: '',
    endDate: '',
    reason: '',
  });

  const { leaveRequests, addLeaveRequest, calculateLeaveBalance } = useLeaveStore();
  const employeeLeave = leaveRequests.filter(req => req.employeeId === employeeId);
  const leaveBalance = calculateLeaveBalance(employeeId, new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateLeaveRequest(
      new Date(formData.startDate),
      new Date(formData.endDate),
      formData.type,
      leaveBalance
    );

    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    addLeaveRequest({
      employeeId,
      ...formData,
      status: 'pending'
    });

    setShowRequestForm(false);
    setFormData({
      type: 'annual',
      startDate: '',
      endDate: '',
      reason: '',
    });

    toast.success('Leave request submitted successfully');
  };

  const handleExport = () => {
    const data = [
      ['Leave History'],
      ['Employee ID:', employeeId],
      ['Generated:', format(new Date(), 'dd/MM/yyyy')],
      [''],
      ['Type', 'Start Date', 'End Date', 'Days', 'Status', 'Reason'],
      ...employeeLeave.map(leave => [
        leave.type.toUpperCase(),
        format(new Date(leave.startDate), 'dd/MM/yyyy'),
        format(new Date(leave.endDate), 'dd/MM/yyyy'),
        differenceInDays(new Date(leave.endDate), new Date(leave.startDate)) + 1,
        leave.status.toUpperCase(),
        leave.reason || '-'
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leave History');
    XLSX.writeFile(wb, `leave-history-${employeeId}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Leave history exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Leave Management</h3>
        <div className="flex space-x-4">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export History</span>
          </button>
          <button
            onClick={() => setShowRequestForm(true)}
            className="btn-primary"
          >
            Request Leave
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm text-indigo-600">Annual Leave Balance</p>
          <p className="text-2xl font-bold text-indigo-700">{leaveBalance} days</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600">Sick Leave Balance</p>
          <p className="text-2xl font-bold text-green-700">10 days</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600">Public Holidays</p>
          <p className="text-2xl font-bold text-blue-700">11 days</p>
        </div>
      </div>

      {showRequestForm && (
        <div className="bg-white rounded-lg border p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Leave Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="input-field"
                required
              >
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="bereavement">Bereavement Leave</option>
                <option value="parental">Parental Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate || format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reason
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Provide details about your leave request"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowRequestForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium mb-4">Leave History</h3>
        <div className="space-y-4">
          {employeeLeave.map((leave) => (
            <div
              key={leave.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      leave.type === 'annual'
                        ? 'bg-indigo-100 text-indigo-800'
                        : leave.type === 'sick'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {leave.type.toUpperCase()}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      leave.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : leave.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {leave.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      {format(new Date(leave.startDate), 'MMM d')} -{' '}
                      {format(new Date(leave.endDate), 'MMM d, yyyy')}
                    </div>
                    {leave.reason && (
                      <p className="mt-1 text-sm text-gray-600">{leave.reason}</p>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {differenceInDays(new Date(leave.endDate), new Date(leave.startDate)) + 1} days
                </div>
              </div>
            </div>
          ))}

          {employeeLeave.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No leave history found
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">NZ Leave Entitlements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>4 weeks annual leave after 12 months</li>
              <li>10 days sick leave after 6 months</li>
              <li>3 days bereavement leave</li>
              <li>11 public holidays</li>
              <li>Up to 52 weeks parental leave</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};