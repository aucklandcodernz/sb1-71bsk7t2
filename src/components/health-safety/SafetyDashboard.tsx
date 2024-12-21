import React from 'react';
import { useHealthSafetyStore } from '../../store/healthSafetyStore';
import { Shield, AlertTriangle, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { generateWorkSafeReport } from '../../utils/nzReportingUtils';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export const SafetyDashboard = () => {
  const stats = useHealthSafetyStore((state) => state.getStats());

  const handleExport = () => {
    const report = generateWorkSafeReport('incident', stats);
    XLSX.writeFile(report, `safety-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Safety report exported successfully');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Days Without Incident</p>
                <p className="text-2xl font-bold mt-1">{stats.daysWithoutIncident}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Open Incidents</p>
                <p className="text-2xl font-bold mt-1">{stats.openIncidents}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertTriangle className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Staff Trained</p>
                <p className="text-2xl font-bold mt-1">{stats.trainedStaff}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Next Review Due</p>
                <p className="text-2xl font-bold mt-1">
                  {format(new Date(stats.nextReviewDate), 'MMM d')}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Calendar className="text-indigo-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'incident'
                      ? 'bg-red-100'
                      : activity.type === 'hazard'
                      ? 'bg-yellow-100'
                      : 'bg-green-100'
                  }`}>
                    <AlertTriangle className={`${
                      activity.type === 'incident'
                        ? 'text-red-600'
                        : activity.type === 'hazard'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`} size={16} />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.user}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {format(new Date(activity.date), 'MMM d, HH:mm')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full btn-primary flex items-center justify-center">
              <AlertTriangle size={20} className="mr-2" />
              Report Incident
            </button>
            <button 
              onClick={handleExport}
              className="w-full btn-secondary flex items-center justify-center"
            >
              <Shield size={20} className="mr-2" />
              Export Safety Report
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Training</h3>
          <div className="space-y-4">
            {stats.upcomingTraining.map((training, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{training.title}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(training.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  training.mandatory
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {training.mandatory ? 'Required' : 'Optional'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">WorkSafe NZ Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Report notifiable incidents within 24 hours</li>
                <li>Maintain hazard register</li>
                <li>Regular safety inspections</li>
                <li>Staff training records</li>
                <li>Emergency procedures</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};