import React from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { DollarSign, Clock, AlertCircle, TrendingUp } from 'lucide-react';

export const ExpenseStats = () => {
  const stats = useExpenseStore((state) => state.getExpenseStats());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Expenses</p>
            <p className="text-2xl font-bold mt-1">
              ${stats.totalAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              GST: ${(stats.totalAmount * 0.15).toLocaleString()}
            </p>
          </div>
          <div className="bg-indigo-100 p-3 rounded-lg">
            <DollarSign className="text-indigo-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Pending Approval</p>
            <p className="text-2xl font-bold mt-1">{stats.totalPending}</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <Clock className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Approved</p>
            <p className="text-2xl font-bold mt-1">{stats.totalApproved}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <AlertCircle className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Average per Expense</p>
            <p className="text-2xl font-bold mt-1">
              ${((stats.totalAmount || 0) / (stats.totalApproved + stats.totalPending || 1)).toFixed(2)}
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