import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface CourseProgressProps {
  totalModules: number;
  completedModules: string[];
  currentModule: string;
}

export const CourseProgress = ({
  totalModules,
  completedModules,
  currentModule,
}: CourseProgressProps) => {
  const progress = (completedModules.length / totalModules) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Course Progress</span>
        <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
      </div>
      <div className="relative">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-300"
          />
        </div>
        <div className="absolute top-2 left-0 right-0 flex justify-between px-1">
          {Array.from({ length: totalModules }).map((_, index) => (
            <div
              key={index}
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                currentModule === index
                  ? 'bg-indigo-100'
                  : completedModules.includes(index.toString())
                  ? 'bg-green-100'
                  : 'bg-gray-100'
              }`}
            >
              {completedModules.includes(index.toString()) ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Circle className="w-4 h-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};