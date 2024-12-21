import React from 'react';
import { usePerformanceStore } from '../../store/performanceStore';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface PerformanceChartProps {
  employeeId: string;
}

export const PerformanceChart = ({ employeeId }: PerformanceChartProps) => {
  const reviews = usePerformanceStore((state) => state.getEmployeeReviews(employeeId));
  const latestReview = reviews[0];

  if (!latestReview) return null;

  const chartData = {
    labels: [
      'Technical Skills',
      'Communication',
      'Initiative',
      'Teamwork',
      'Leadership',
      'Quality',
    ],
    datasets: [
      {
        label: 'Current Review',
        data: [4.5, 4.0, 3.8, 4.2, 3.9, 4.3],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
      {
        label: 'Previous Review',
        data: [4.2, 3.8, 3.5, 4.0, 3.7, 4.1],
        backgroundColor: 'rgba(209, 213, 219, 0.2)',
        borderColor: 'rgba(209, 213, 219, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Performance Trends</h3>
      <div className="aspect-square">
        <Radar
          data={chartData}
          options={{
            scales: {
              r: {
                min: 0,
                max: 5,
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
            plugins: {
              legend: {
                position: 'bottom',
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.raw as number;
                    return `Rating: ${value.toFixed(1)}/5.0`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};