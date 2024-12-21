import React from 'react';
import { useTrainingStore } from '../../store/trainingStore';
import { Book, Users, Award, TrendingUp } from 'lucide-react';

export const TrainingStats = () => {
  const stats = useTrainingStore((state) => state.getCourseStats());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Courses</p>
            <p className="text-2xl font-bold mt-1">{stats.totalCourses}</p>
          </div>
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Book className="text-indigo-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Active Enrollments</p>
            <p className="text-2xl font-bold mt-1">{stats.totalEnrollments}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <Users className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Completion Rate</p>
            <p className="text-2xl font-bold mt-1">
              {Math.round(stats.completionRate)}%
            </p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <Award className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Average Rating</p>
            <p className="text-2xl font-bold mt-1">
              {stats.averageRating.toFixed(1)}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <TrendingUp className="text-blue-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};