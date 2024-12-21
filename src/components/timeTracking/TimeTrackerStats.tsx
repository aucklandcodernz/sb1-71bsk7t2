import React from 'react';
import { useTimeTrackingStore } from '../../store/timeTrackingStore';
import { Clock, AlertCircle, Calendar, TrendingUp } from 'lucide-react';
import { format, startOfWeek, endOfWeek, differenceInHours } from 'date-fns';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TimeTrackerStatsProps {
  employeeId: string;
}

export const TimeTrackerStats = ({ employeeId }: TimeTrackerStatsProps) => {
  const entries = useTimeTrackingStore((state) => 
    state.getEmployeeEntries(employeeId)
  );

  const weekStart = startOfWeek(new Date()).toISOString();
  const weekEnd = endOfWeek(new Date()).toISOString();

  const weeklyEntries = entries.filter(
    entry => entry.clockIn >= weekStart && entry.clockIn <= weekEnd
  );

  const activeEntry = entries.find(entry => !entry.clockOut);

  const calculateHoursByType = () => {
    return weeklyEntries.reduce((acc, entry) => {
      if (!entry.clockOut) return acc;

      const duration = differenceInHours(
        new Date(entry.clockOut),
        new Date(entry.clockIn)
      );

      acc[entry.type] = (acc[entry.type] || 0) + duration;
      return acc;
    }, {} as Record<string, number>);
  };

  const hoursByType = calculateHoursByType();

  const chartData = {
    labels: ['Regular', 'Overtime', 'Public Holiday'],
    datasets: [
      {
        data: [
          hoursByType.regular || 0,
          hoursByType.overtime || 0,
          hoursByType.public_holiday || 0,
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.2)',
          'rgba(245, 158, 11, 0.2)',
          'rgba(16, 185, 129, 0.2)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const totalHours = Object.values(hoursByType).reduce((a, b) => a + b, 0);
  const averageHoursPerDay = totalHours / 5; // Assuming 5-day work week

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Hours</p>
              <p className="text-2xl font-bold mt-1">{totalHours.toFixed(1)}h</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Clock className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Daily</p>
              <p className="text-2xl font-bold mt-1">
                {averageHoursPerDay.toFixed(1)}h
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Overtime</p>
              <p className="text-2xl font-bold mt-1">
                {(hoursByType.overtime || 0).toFixed(1)}h
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <p className="text-2xl font-bold mt-1">
                {activeEntry ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-gray-600">Inactive</span>
                )}
              </p>
            </div>
            <div className={`${
              activeEntry ? 'bg-green-100' : 'bg-gray-100'
            } p-3 rounded-lg`}>
              <AlertCircle className={`${
                activeEntry ? 'text-green-600' : 'text-gray-600'
              }`} size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Hours Distribution</h3>
          <div className="aspect-square">
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.raw as number;
                        return `${value.toFixed(1)} hours`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Weekly Overview</h3>
          <div className="space-y-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => {
              const dayEntries = weeklyEntries.filter(entry => 
                new Date(entry.clockIn).getDay() === index + 1
              );
              
              const dayHours = dayEntries.reduce((total, entry) => {
                if (!entry.clockOut) return total;
                return total + differenceInHours(
                  new Date(entry.clockOut),
                  new Date(entry.clockIn)
                );
              }, 0);

              return (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-gray-600">{day}</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-indigo-600 rounded-full"
                        style={{ width: `${(dayHours / 8) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-gray-900 font-medium">
                    {dayHours.toFixed(1)}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">NZ Employment Law:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Standard work week: 40 hours</li>
              <li>Time and a half for first 3 overtime hours</li>
              <li>Double time for subsequent overtime hours</li>
              <li>Rest breaks required after 2 and 4 hours</li>
              <li>11-hour rest period between shifts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};