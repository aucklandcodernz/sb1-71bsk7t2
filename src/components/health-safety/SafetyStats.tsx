import React from 'react';
import { useHealthSafetyStore } from '../../store/healthSafetyStore';
import { Shield, AlertTriangle, Clock, Calendar } from 'lucide-react';

export const SafetyStats = () => {
  const stats = useHealthSafetyStore((state) => state.getStats());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            <p className="text-gray-500 text-sm">Critical Hazards</p>
            <p className="text-2xl font-bold mt-1">{stats.criticalHazards}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-lg">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Upcoming Reviews</p>
            <p className="text-2xl font-bold mt-1">{stats.upcomingReviews}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Calendar className="text-blue-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};