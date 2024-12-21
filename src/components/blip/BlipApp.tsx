import React, { useState, useEffect } from 'react';
import { useBlipStore } from '../../store/blipStore';
import { Play, Pause, Coffee, MapPin, AlertCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface BlipAppProps {
  employeeId: string;
}

export const BlipApp = ({ employeeId }: BlipAppProps) => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const {
    startSession,
    endSession,
    startBreak,
    endBreak,
    isWithinWorkLocation,
    getActiveSession,
    settings
  } = useBlipStore();
  
  const activeSession = getActiveSession(employeeId);
  const activeBreak = activeSession?.breaks.find(b => !b.endTime);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation(position),
        (error) => setError('Location access is required for time tracking.')
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    if (!location) {
      toast.error('Location is required to clock in.');
      return;
    }

    const locationData = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: new Date().toISOString()
    };

    if (!isWithinWorkLocation(locationData)) {
      toast.error('You must be at a designated work location to clock in.');
      return;
    }

    // Check if within allowed work hours
    const currentHour = currentTime.getHours();
    const [startHour] = settings.workHours.start.split(':').map(Number);
    const [endHour] = settings.workHours.end.split(':').map(Number);

    if (currentHour < startHour || currentHour >= endHour) {
      toast.error('Clock-in is only allowed during work hours.');
      return;
    }

    startSession(employeeId, locationData);
    toast.success('Successfully clocked in!');
  };

  const handleClockOut = () => {
    if (!location || !activeSession) return;

    const locationData = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: new Date().toISOString()
    };

    endSession(activeSession.id, locationData);
    toast.success('Successfully clocked out!');
  };

  const handleBreak = () => {
    if (!activeSession) return;

    if (activeBreak) {
      endBreak(activeSession.id);
      toast.success('Break ended');
    } else {
      // Check if minimum work period has been met (NZ law requires breaks after certain periods)
      const workStart = new Date(activeSession.clockIn.time);
      const hoursWorked = (currentTime.getTime() - workStart.getTime()) / (1000 * 60 * 60);

      if (hoursWorked < 2) {
        toast.error('Breaks are available after 2 hours of work');
        return;
      }

      startBreak(activeSession.id, hoursWorked >= 4 ? 'lunch' : 'rest');
      toast.success('Break started');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Blip Time Tracking</h2>
        {location && (
          <div className="flex items-center text-sm text-green-600">
            <MapPin size={16} className="mr-1" />
            Location verified
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center">
          <AlertCircle size={16} className="mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">
            {format(currentTime, 'HH:mm:ss')}
          </div>
          <div className="text-gray-500">
            {format(currentTime, 'EEEE, MMMM d, yyyy')}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={activeSession ? handleClockOut : handleClockIn}
            disabled={!location}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center space-x-2 ${
              activeSession
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {activeSession ? (
              <>
                <Pause size={20} />
                <span>Clock Out</span>
              </>
            ) : (
              <>
                <Play size={20} />
                <span>Clock In</span>
              </>
            )}
          </button>

          {activeSession && (
            <button
              onClick={handleBreak}
              disabled={!location}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center space-x-2 ${
                activeBreak
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Coffee size={20} />
              <span>{activeBreak ? 'End Break' : 'Start Break'}</span>
            </button>
          )}
        </div>

        {activeSession && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Current Session</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Clock In:</span>
                <span>{format(new Date(activeSession.clockIn.time), 'HH:mm:ss')}</span>
              </div>
              {activeBreak && (
                <div className="flex justify-between text-yellow-800">
                  <span>On Break Since:</span>
                  <span>{format(new Date(activeBreak.startTime), 'HH:mm:ss')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Work Hours:</span>
                <span>{settings.workHours.start} - {settings.workHours.end}</span>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>• Rest breaks required after 2 hours of work</p>
          <p>• Meal break required after 4 hours of work</p>
          <p>• Location tracking enabled for accurate time recording</p>
        </div>
      </div>
    </div>
  );
};