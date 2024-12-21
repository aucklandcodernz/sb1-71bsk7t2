import React, { useState } from 'react';
import { useRosterStore } from '../store/rosterStore';
import { Calendar, Users, Clock, Plus } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { RosterCalendar } from '../components/roster/RosterCalendar';
import { ShiftPatternForm } from '../components/roster/ShiftPatternForm';
import { RosterStats } from '../components/roster/RosterStats';

const RosterManagement = () => {
  const [showPatternForm, setShowPatternForm] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date()));
  
  const { weeks, patterns, getWeekStats } = useRosterStore();
  const weekStats = getWeekStats(selectedWeek.toISOString());

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roster Management</h1>
          <p className="text-gray-500">Schedule and manage employee shifts</p>
        </div>
        <button
          onClick={() => setShowPatternForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Shift Pattern</span>
        </button>
      </div>

      <RosterStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <RosterCalendar
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Shift Patterns</h2>
            <div className="space-y-4">
              {patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <h3 className="font-medium">{pattern.name}</h3>
                  <div className="mt-2 space-y-2">
                    {pattern.pattern.map((shift, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {format(new Date(2024, 0, shift.dayOfWeek), 'EEEE')}: {shift.startTime} - {shift.endTime}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Week Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Hours:</span>
                <span className="font-medium">{weekStats.totalHours.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Employees Scheduled:</span>
                <span className="font-medium">{weekStats.employeeCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Shifts:</span>
                <span className="font-medium">{weekStats.shiftsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPatternForm && (
        <ShiftPatternForm onClose={() => setShowPatternForm(false)} />
      )}
    </div>
  );
};

export default RosterManagement;