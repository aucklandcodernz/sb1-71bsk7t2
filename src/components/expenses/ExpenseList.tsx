import React from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { format } from 'date-fns';
import { FileText, Download, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExpenseListProps {
  selectedCategory: string | null;
  dateRange: {
    start: string;
    end: string;
  };
  searchQuery: string;
}

export const ExpenseList = ({ selectedCategory, dateRange, searchQuery }: ExpenseListProps) => {
  const { expenses, approveExpense, rejectExpense } = useExpenseStore();

  const filteredExpenses = expenses.filter((expense) => {
    if (selectedCategory && expense.category !== selectedCategory) return false;
    if (dateRange.start && expense.date < dateRange.start) return false;
    if (dateRange.end && expense.date > dateRange.end) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleApprove = (id: string) => {
    approveExpense(id, 'current-user'); // In a real app, get from auth context
    toast.success('Expense approved');
  };

  const handleReject = (id: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      rejectExpense(id, reason);
      toast.success('Expense rejected');
    }
  };

  const handleDownloadReceipt = (expense: any) => {
    // In a real app, this would download the actual receipt
    toast.success(`Downloading receipt for expense: ${expense.description}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GST
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredExpenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {format(new Date(expense.date), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {expense.category}
              </td>
              <td className="px-6 py-4 text-sm">{expense.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                ${expense.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                ${(expense.amount * 0.15).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    expense.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : expense.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {expense.status.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex space-x-2">
                  {expense.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(expense.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Approve"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={() => handleReject(expense.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Reject"
                      >
                        <X size={20} />
                      </button>
                    </>
                  )}
                  {expense.receiptUrl && (
                    <button
                      onClick={() => handleDownloadReceipt(expense)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Download Receipt"
                    >
                      <Download size={20} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredExpenses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No expenses found
        </div>
      )}
    </div>
  );
};