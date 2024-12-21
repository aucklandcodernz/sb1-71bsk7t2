import React, { useState, useEffect } from 'react';
import { useTimeTrackingStore } from '../../store/timeTrackingStore';
import { Play, Pause, Coffee, MapPin, AlertCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { calculateBreakRequirements, validateWorkHours } from '../../utils/timeTrackingUtils';
import toast from 'react-hot-toast';

interface TimeTrackerProps {
  employeeId: string;
}

export const TimeTracker = ({ employeeId }: TimeTrackerProps) => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const {
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    getActiveEntry,
    settings,
  } = useTimeTrackingStore();

  const activeEntry = getActiveEntry(employeeId);
  const activeBreak = activeEntry?.breaks.find(b => !b.endTime);

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    if (!location) {
      toast.error('Location is required to clock in.');
      return;
    }

    if (!validateWorkHours(new Date(), settings)) {
      toast.error('Clock-in is only allowed during work hours.');
      return;
    }

    clockIn(employeeId, 'regular', {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    toast.success('Successfully clocked in!');
  };

  const handleClockOut = () => {
    if (!location || !activeEntry) return;

    if (activeBreak) {
      toast.error('Please end your break before clocking out.');
      return;
    }

    clockOut(employeeId, {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    toast.success('Successfully clocked out!');
  };

  const handleBreak = () => {
    if (!activeEntry) return;

    if (activeBreak) {
      endBreak(activeEntry.id);
      toast.success('Break ended');
    } else {
      // Check if minimum work period has been met
      const workStart = new Date(activeEntry.clockIn);
      const hoursWorked = (currentTime.getTime() - workStart.getTime()) / (1000 * 60 * 60);

      if (hoursWorked < 2) {
        toast.error('Breaks are available after 2 hours of work');
        return;
      }

      startBreak(activeEntry.id, hoursWorked >= 4 ? 'meal' : 'rest');
      toast.success(`${hoursWorked >= 4 ? 'Meal' : 'Rest'} break started`);
    }
  };

  const breakRequirements = activeEntry
    ? calculateBreakRequirements(activeEntry.clockIn)
    : { restBreakDue: false, mealBreakDue: false };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Time Tracking</h2>
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

      <div className="text-center">
        <div className="mb-4">
          <div className="text-3xl font-bold">
            {format(currentTime, 'HH:mm:ss')}
          </div>
          <div className="text-gray-500">
            {format(currentTime, 'EEEE, MMMM d, yyyy')}
          </div>
        </div>

        {activeEntry ? (
          <>
            <div className="mb-4">
              <Clock className="w-12 h-12 text-indigo-600 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Clocked in at:</p>
              <p className="font-medium">
                {format(new Date(activeEntry.clockIn), 'HH:mm')}
              </p>
            </div>

            {(breakRequirements.restBreakDue || breakRequirements.mealBreakDue) && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {breakRequirements.mealBreakDue
                    ? 'Meal break required'
                    : 'Rest break recommended'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleBreak}
                className={`btn-secondary flex items-center justify-center ${
                  activeBreak ? 'bg-yellow-100 text-yellow-800' : ''
                }`}
              >
                <Coffee size={20} className="mr-2" />
                {activeBreak ? 'End Break' : 'Take Break'}
              </button>
              <button
                onClick={handleClockOut}
                className="btn-primary flex items-center justify-center"
              >
                <Pause size={20} className="mr-2" />
                Clock Out
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={handleClockIn}
            disabled={!location}
            className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={20} className="mr-2" />
            Clock In
          </button>
        )}
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <p>• Location tracking required for accurate time recording</p>
        <p>• Rest breaks (10 min) required after 2 hours of work</p>
        <p>• Meal break (30 min) required after 4 hours of work</p>
        <p>• Maximum work duration: 8 hours before overtime</p>
        <p>• Time and a half for first 3 hours of overtime</p>
        <p>• Double time for subsequent hours</p>
      </div>
    </div>
  );
};