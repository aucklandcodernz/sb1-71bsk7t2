import React, { useState } from 'react';
import { useBlipStore } from '../../store/blipStore';
import { MapPin, Clock, Bell } from 'lucide-react';

export const BlipSettings = () => {
  const { settings, updateSettings } = useBlipStore();
  const [newLocation, setNewLocation] = useState({
    name: '',
    latitude: '',
    longitude: ''
  });

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateSettings({
      geofencing: {
        ...settings.geofencing,
        locations: [
          ...settings.geofencing.locations,
          {
            id: Math.random().toString(36).substr(2, 9),
            name: newLocation.name,
            latitude: parseFloat(newLocation.latitude),
            longitude: parseFloat(newLocation.longitude)
          }
        ]
      }
    });
    
    setNewLocation({ name: '', latitude: '', longitude: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Blip Settings</h2>
      </div>

      <div className="p-6 space-y-8">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <MapPin size={16} className="mr-2" />
            Geofencing
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.geofencing.enabled}
                onChange={(e) =>
                  updateSettings({
                    geofencing: {
                      ...settings.geofencing,
                      enabled: e.target.checked
                    }
                  })
                }
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Enable location-based clock in/out
              </span>
            </label>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Allowed Radius (meters)
              </label>
              <input
                type="number"
                value={settings.geofencing.radius}
                onChange={(e) =>
                  updateSettings({
                    geofencing: {
                      ...settings.geofencing,
                      radius: parseInt(e.target.value)
                    }
                  })
                }
                className="input-field w-32"
                min="50"
                max="1000"
              />
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Work Locations
              </h4>
              <div className="space-y-2">
                {settings.geofencing.locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{location.name}</p>
                      <p className="text-sm text-gray-500">
                        {location.latitude}, {location.longitude}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddLocation} className="mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Location Name"
                    value={newLocation.name}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, name: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Latitude"
                    value={newLocation.latitude}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, latitude: e.target.value })
                    }
                    className="input-field"
                    required
                    pattern="-?\d+\.\d+"
                  />
                  <input
                    type="text"
                    placeholder="Longitude"
                    value={newLocation.longitude}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, longitude: e.target.value })
                    }
                    className="input-field"
                    required
                    pattern="-?\d+\.\d+"
                  />
                </div>
                <button type="submit" className="btn-primary mt-2">
                  Add Location
                </button>
              </form>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <Clock size={16} className="mr-2" />
            Work Hours
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={settings.workHours.start}
                onChange={(e) =>
                  updateSettings({
                    workHours: {
                      ...settings.workHours,
                      start: e.target.value
                    }
                  })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={settings.workHours.end}
                onChange={(e) =>
                  updateSettings({
                    workHours: {
                      ...settings.workHours,
                      end: e.target.value
                    }
                  })
                }
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <Bell size={16} className="mr-2" />
            Notifications
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.reminderEnabled}
                onChange={(e) =>
                  updateSettings({
                    notifications: {
                      ...settings.notifications,
                      reminderEnabled: e.target.checked
                    }
                  })
                }
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Enable shift reminders
              </span>
            </label>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Reminder Time (minutes before shift)
              </label>
              <input
                type="number"
                value={settings.notifications.reminderTime}
                onChange={(e) =>
                  updateSettings({
                    notifications: {
                      ...settings.notifications,
                      reminderTime: parseInt(e.target.value)
                    }
                  })
                }
                className="input-field w-32"
                min="5"
                max="60"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};