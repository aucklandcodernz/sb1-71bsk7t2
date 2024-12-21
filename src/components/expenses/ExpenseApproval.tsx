import React from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { format } from 'date-fns';
import { Check, X, FileText } from 'lucide-react';

export const ExpenseApproval = () => {
  const { expenses, approveExpense, rejectExpense } = useExpenseStore();
  const pendingExpenses = expenses.filter((e) => e.status === 'pending');

  const handleApprove = (id: string) => {
    approveExpense(id, 'current-user'); // In a real app, get from auth context
  };

  const handleReject = (id: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      rejectExpense(id, reason);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Pending Approvals</h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {pendingExpenses.map((expense) => (
            <div
              key={expense.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{expense.employeeId}</div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(expense.date), 'MMM d, yyyy')}
                  </div>
                  <div className="mt-1 text-sm">{expense.description}</div>
                  <div className="mt-2 text-lg font-medium">
                    ${expense.amount.toLocaleString()}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {expense.receiptUrl && (
                    <button
                      onClick={() => window.open(expense.receiptUrl, '_blank')}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                      title="View Receipt"
                    >
                      <FileText size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => handleApprove(expense.id)}
                    className="p-2 hover:bg-green-100 rounded-lg text-green-600"
                    title="Approve"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => handleReject(expense.id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                    title="Reject"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pendingExpenses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No pending expenses to approve
            </div>
          )}
        </div>
      </div>
    </div>
  );
};