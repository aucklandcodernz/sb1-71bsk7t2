import React from 'react';
import { usePerformanceStore } from '../../store/performanceStore';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface PerformanceGoalsProps {
  employeeId: string;
}

export const PerformanceGoals = ({ employeeId }: PerformanceGoalsProps) => {
  const reviews = usePerformanceStore((state) => state.getEmployeeReviews(employeeId));
  const latestReview = reviews[0];

  if (!latestReview) {
    return (
      <div className="text-center py-8 text-gray-500">
        No performance goals found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Current Goals</h3>
        <div className="space-y-4">
          {latestReview.goals.current.map((goal) => (
            <div
              key={goal.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{goal.description}</h4>
                  {goal.measures.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 font-medium">Success Measures:</p>
                      <ul className="mt-1 space-y-1">
                        {goal.measures.map((measure, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                            {measure}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  goal.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : goal.status === 'in_progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {goal.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {latestReview.goals.previous.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Previous Goals</h3>
          <div className="space-y-4">
            {latestReview.goals.previous.map((goal) => (
              <div
                key={goal.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{goal.description}</h4>
                    {goal.achievements && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 font-medium">Achievements:</p>
                        <ul className="mt-1 space-y-1">
                          {goal.achievements.map((achievement, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <CheckCircle className="text-green-500 w-4 h-4 mr-2" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    goal.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {goal.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Goal Setting Best Practices:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)</li>
              <li>Align goals with company objectives</li>
              <li>Include both performance and development goals</li>
              <li>Review and update goals regularly</li>
              <li>Celebrate achievements and learn from setbacks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};