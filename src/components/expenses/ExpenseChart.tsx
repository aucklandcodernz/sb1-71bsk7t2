import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useExpenseStore } from '../../store/expenseStore';
import { formatCurrency } from '../../utils/expenseUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ExpenseChart = () => {
  const stats = useExpenseStore((state) => state.getExpenseStats());

  const data = {
    labels: Object.keys(stats.byCategory).map(
      (key) => key.charAt(0).toUpperCase() + key.slice(1)
    ),
    datasets: [
      {
        data: Object.values(stats.byCategory),
        backgroundColor: [
          'rgba(99, 102, 241, 0.2)', // Indigo
          'rgba(16, 185, 129, 0.2)', // Green
          'rgba(245, 158, 11, 0.2)', // Yellow
          'rgba(239, 68, 68, 0.2)',  // Red
          'rgba(59, 130, 246, 0.2)', // Blue
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Expense Distribution</h2>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-500 text-center">
        Total GST Claimable: {formatCurrency(stats.totalAmount * 0.15)}
      </div>
    </div>
  );
};