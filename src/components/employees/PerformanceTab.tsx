import React, { useState } from 'react';
import { usePerformanceStore } from '../../store/performanceStore';
import { PerformanceReviewForm } from '../performance/PerformanceReviewForm';
import { PerformanceChart } from '../performance/PerformanceChart';
import { PerformanceHistory } from '../performance/PerformanceHistory';
import { PerformanceGoals } from '../performance/PerformanceGoals';
import { Star, TrendingUp, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

interface PerformanceTabProps {
  employeeId: string;
}

export const PerformanceTab = ({ employeeId }: PerformanceTabProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'history'>('overview');
  
  const reviews = usePerformanceStore((state) => state.getEmployeeReviews(employeeId));
  const stats = usePerformanceStore((state) => state.getPerformanceStats(employeeId));

  const handleExport = () => {
    const data = [
      ['Performance Review History'],
      ['Employee ID:', employeeId],
      ['Generated:', format(new Date(), 'dd/MM/yyyy')],
      [''],
      ['Review Date', 'Type', 'Status', 'Average Rating', 'Reviewer'],
      ...reviews.map(review => [
        format(new Date(review.reviewDate), 'dd/MM/yyyy'),
        review.type.toUpperCase(),
        review.status.toUpperCase(),
        Object.values(review.ratings).reduce((a, b) => a + b, 0) / Object.values(review.ratings).length,
        review.reviewerId,
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Performance History');
    XLSX.writeFile(wb, `performance-history-${employeeId}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Performance history exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Performance Management</h3>
          <p className="text-sm text-gray-500">Track and manage employee performance</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export History</span>
          </button>
          <button
            onClick={() => setShowReviewForm(true)}
            className="btn-primary"
          >
            New Review
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Rating</p>
              <p className="text-2xl font-bold mt-1">
                {stats.averageRating.toFixed(1)}/5.0
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Reviews Completed</p>
              <p className="text-2xl font-bold mt-1">{stats.completedReviews}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Next Review</p>
              <p className="text-2xl font-bold mt-1">
                {stats.nextReviewDate
                  ? format(new Date(stats.nextReviewDate), 'MMM d')
                  : 'Not Set'}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'overview'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'goals'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Goals
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'history'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            History
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart employeeId={employeeId} />
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Recent Feedback</h3>
            {stats.strengths.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Strengths</h4>
                <ul className="space-y-2">
                  {stats.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {stats.improvementAreas.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Areas for Improvement</h4>
                <ul className="space-y-2">
                  {stats.improvementAreas.map((area, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'goals' && <PerformanceGoals employeeId={employeeId} />}
      {activeTab === 'history' && <PerformanceHistory employeeId={employeeId} />}

      {showReviewForm && (
        <PerformanceReviewForm
          employeeId={employeeId}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
};