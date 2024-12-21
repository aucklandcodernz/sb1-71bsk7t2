import React from 'react';
import { useHealthSafetyStore } from '../../store/healthSafetyStore';
import { AlertTriangle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export const IncidentList = () => {
  const incidents = useHealthSafetyStore((state) => state.incidents);
  const updateIncident = useHealthSafetyStore((state) => state.updateIncident);

  const handleStatusChange = (id: string, status: 'investigating' | 'resolved') => {
    updateIncident(id, { status });
  };

  const getIncidentColor = (type: string) => {
    switch (type) {
      case 'serious':
        return 'bg-red-100 text-red-800';
      case 'minor':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <div
          key={incident.id}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">{incident.type}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIncidentColor(incident.type)}`}>
                  {incident.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Reported by: {incident.reportedBy}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              incident.status === 'investigating'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {incident.status.toUpperCase()}
            </span>
          </div>

          <p className="mt-4 text-gray-700">{incident.description}</p>

          {incident.actions.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">Corrective Actions:</h4>
              <div className="space-y-2">
                {incident.actions.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{action.description}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        Due: {format(new Date(action.dueDate), 'MMM d, yyyy')}
                        <span className="mx-2">•</span>
                        Assigned to: {action.assignee}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={action.completed}
                        onChange={() => {
                          // Handle action completion
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {incident.type === 'serious' && (
            <div className="mt-4 flex items-center">
              {incident.worksafeNotified ? (
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle size={16} className="mr-1" />
                  WorkSafe NZ notified
                </div>
              ) : (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle size={16} className="mr-1" />
                  WorkSafe NZ notification required
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-4">
            {incident.status === 'investigating' && (
              <button
                onClick={() => handleStatusChange(incident.id, 'resolved')}
                className="btn-primary flex items-center space-x-2"
              >
                <CheckCircle size={16} />
                <span>Mark as Resolved</span>
              </button>
            )}
          </div>
        </div>
      ))}

      {incidents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No incidents reported. Click "Report Incident" to add one.
        </div>
      )}
    </div>
  );
};