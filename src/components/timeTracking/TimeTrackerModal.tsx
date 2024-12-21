import React, { useState } from 'react';
import { X, Clock, Calendar, AlertCircle } from 'lucide-react';
import { TimeTracker } from './TimeTracker';
import { TimeSheet } from './TimeSheet';
import { TimeTrackerStats } from './TimeTrackerStats';
import { BreakTimer } from './BreakTimer';
import { OvertimeRequest } from './OvertimeRequest';
import { format, subDays } from 'date-fns';
import { calculateBreakRequirements } from '../../utils/timeTrackingUtils';
import toast from 'react-hot-toast';

interface TimeTrackerModalProps {
  employeeId: string;
  onClose: () => void;
}

export const TimeTrackerModal = ({ employeeId, onClose }: TimeTrackerModalProps) => {
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 7), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState<'timesheet' | 'stats'>('timesheet');

  const handleBreakComplete = () => {
    toast.success('Break completed successfully');
  };

  const handleOvertimeRequest = (data: any) => {
    toast.success('Overtime request submitted for approval');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Time Tracking</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <TimeTracker employeeId={employeeId} />
            <BreakTimer onBreakComplete={handleBreakComplete} />
            <OvertimeRequest onSubmit={handleOvertimeRequest} />
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('timesheet')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                    activeTab === 'timesheet'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Calendar size={16} className="mr-2" />
                  Timesheet
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                    activeTab === 'stats'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Clock size={16} className="mr-2" />
                  Stats
                </button>
              </nav>
            </div>

            {activeTab === 'timesheet' ? (
              <>
                <div className="mb-4 flex space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
                <TimeSheet
                  employeeId={employeeId}
                  startDate={startDate}
                  endDate={endDate}
                />
              </>
            ) : (
              <TimeTrackerStats employeeId={employeeId} />
            )}

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">NZ Employment Law Reminders:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Rest breaks (10 min) required after 2 hours of work</li>
                    <li>Meal break (30 min) required after 4 hours of work</li>
                    <li>Maximum 8 hours standard workday</li>
                    <li>Time and a half for first 3 hours overtime</li>
                    <li>Double time for subsequent overtime hours</li>
                    <li>Alternative holiday earned for working on public holidays</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};