import React, { useState } from 'react';
import { useTimeTrackingStore } from '../store/timeTrackingStore';
import { useEmployeeStore } from '../store/employeeStore';
import { TimeTracker } from '../components/timeTracking/TimeTracker';
import { TimeSheet } from '../components/timeTracking/TimeSheet';
import { LocationMap } from '../components/timeTracking/LocationMap';
import { AttendanceStats } from '../components/timeTracking/AttendanceStats';
import { BreakTimer } from '../components/timeTracking/BreakTimer';
import { OvertimeRequest } from '../components/timeTracking/OvertimeRequest';
import { format, subDays } from 'date-fns';
import { Users, Clock, MapPin, Calendar } from 'lucide-react';

const TimeAttendance = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 7), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState<'timesheet' | 'map'>('timesheet');

  const employees = useEmployeeStore((state) => state.getActiveEmployees());
  const getActiveEntry = useTimeTrackingStore((state) => state.getActiveEntry);
  const entries = useTimeTrackingStore((state) => state.entries);

  const locations = entries
    .filter((entry) => entry.location)
    .map((entry) => ({
      latitude: entry.location!.latitude,
      longitude: entry.location!.longitude,
      timestamp: entry.clockIn,
      type: 'clock-in' as const,
    }))
    .concat(
      entries
        .filter((entry) => entry.location && entry.clockOut)
        .map((entry) => ({
          latitude: entry.location!.latitude,
          longitude: entry.location!.longitude,
          timestamp: entry.clockOut!,
          type: 'clock-out' as const,
        }))
    );

  const handleBreakComplete = () => {
    // Handle break completion
    console.log('Break completed');
  };

  const handleOvertimeRequest = (data: any) => {
    // Handle overtime request
    console.log('Overtime requested:', data);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time & Attendance</h1>
          <p className="text-gray-500">Track employee work hours and attendance</p>
        </div>
      </div>

      <AttendanceStats employeeId={selectedEmployeeId || undefined} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Active Employees</h2>
            <div className="space-y-4">
              {employees.map((employee) => {
                const activeEntry = getActiveEntry(employee.id);
                return (
                  <div
                    key={employee.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedEmployeeId === employee.id ? 'border-indigo-500 bg-indigo-50' : ''
                    }`}
                    onClick={() => setSelectedEmployeeId(employee.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <Users size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.position}</p>
                      </div>
                    </div>
                    {activeEntry && (
                      <span className="flex items-center text-green-600 text-sm">
                        <Clock size={16} className="mr-1" />
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {selectedEmployeeId && (
            <>
              <BreakTimer onBreakComplete={handleBreakComplete} />
              <div className="mt-6">
                <OvertimeRequest onSubmit={handleOvertimeRequest} />
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedEmployeeId ? (
            <>
              <div className="mb-6">
                <TimeTracker employeeId={selectedEmployeeId} />
              </div>

              <div className="bg-white rounded-lg shadow mb-6">
                <div className="border-b px-6 py-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveTab('timesheet')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                        activeTab === 'timesheet'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Calendar size={20} />
                      <span>Timesheet</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('map')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                        activeTab === 'map'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <MapPin size={20} />
                      <span>Location History</span>
                    </button>
                  </div>
                </div>

                <div className="p-6">
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
                        employeeId={selectedEmployeeId}
                        startDate={startDate}
                        endDate={endDate}
                      />
                    </>
                  ) : (
                    <LocationMap locations={locations} />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Select an employee to view their time tracking details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeAttendance;