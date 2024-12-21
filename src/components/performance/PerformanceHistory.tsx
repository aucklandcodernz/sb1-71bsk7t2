import React from 'react';
import { usePerformanceStore } from '../../store/performanceStore';
import { format } from 'date-fns';
import { Star } from 'lucide-react';

interface PerformanceHistoryProps {
  employeeId: string;
}

export const PerformanceHistory = ({ employeeId }: PerformanceHistoryProps) => {
  const reviews = usePerformanceStore((state) => state.getEmployeeReviews(employeeId));

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No performance reviews found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-medium">{review.type.toUpperCase()} Review</h3>
              <p className="text-sm text-gray-500">
                {format(new Date(review.reviewDate), 'MMMM d, yyyy')}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              review.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : review.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {review.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Competencies</h4>
              <div className="space-y-2">
                {Object.entries(review.competencies).map(([type, ratings]) => (
                  <div key={type}>
                    <p className="text-sm font-medium capitalize">{type}</p>
                    {ratings.map((rating, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{rating.name}</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((r) => (
                            <Star
                              key={r}
                              size={16}
                              className={r <= rating.rating ? 'text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
              {review.feedback.strengths.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600">Strengths:</p>
                  <ul className="mt-1 space-y-1">
                    {review.feedback.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {review.feedback.improvements.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Areas for Improvement:</p>
                  <ul className="mt-1 space-y-1">
                    {review.feedback.improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {review.development && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Development Plan</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Training Needs:</p>
                  <ul className="mt-1 space-y-1">
                    {review.development.trainingNeeds.map((need, index) => (
                      <li key={index} className="text-sm text-gray-600">• {need}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Action Items:</p>
                  <ul className="mt-1 space-y-1">
                    {review.development.actionItems.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};