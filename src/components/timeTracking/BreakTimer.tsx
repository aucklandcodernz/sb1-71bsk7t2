import React, { useState, useEffect } from 'react';
import { Coffee, Play, Pause, RotateCcw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface BreakTimerProps {
  onBreakComplete: () => void;
  type?: 'rest' | 'meal';
}

export const BreakTimer = ({ onBreakComplete, type = 'rest' }: BreakTimerProps) => {
  // NZ break durations
  const REST_BREAK_DURATION = 10 * 60; // 10 minutes in seconds
  const MEAL_BREAK_DURATION = 30 * 60; // 30 minutes in seconds

  const [timeLeft, setTimeLeft] = useState(
    type === 'meal' ? MEAL_BREAK_DURATION : REST_BREAK_DURATION
  );
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            onBreakComplete();
            toast.success('Break time is over!');
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onBreakComplete]);

  const toggleTimer = () => {
    if (!isRunning && timeLeft === 0) {
      resetTimer();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(type === 'meal' ? MEAL_BREAK_DURATION : REST_BREAK_DURATION);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalSeconds = type === 'meal' ? MEAL_BREAK_DURATION : REST_BREAK_DURATION;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Break Timer</h3>
        <Coffee className="text-gray-400" size={24} />
      </div>

      <div className="text-center mb-6">
        <div className="text-sm font-medium text-gray-500 mb-2">
          {type === 'meal' ? 'Meal Break' : 'Rest Break'}
        </div>
        <div className="relative mb-6">
          <div className="w-48 h-48 mx-auto relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="12"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#6366F1"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={
                  2 * Math.PI * 88 * (1 - getProgressPercentage() / 100)
                }
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleTimer}
          className={`p-4 rounded-full ${
            isRunning
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">NZ Break Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>10-minute paid rest breaks</li>
              <li>30-minute unpaid meal breaks</li>
              <li>Breaks must be taken at agreed times</li>
              <li>Additional breaks for longer shifts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};