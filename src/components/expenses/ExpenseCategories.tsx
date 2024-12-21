import React from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { Plus, DollarSign, Car, Coffee, Building2, FileText } from 'lucide-react';

interface ExpenseCategoriesProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export const ExpenseCategories = ({
  selectedCategory,
  onSelectCategory,
}: ExpenseCategoriesProps) => {
  const { categories, expenses } = useExpenseStore();

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'travel':
        return Car;
      case 'meals':
        return Coffee;
      case 'accommodation':
        return Building2;
      default:
        return FileText;
    }
  };

  const getCategoryTotal = (categoryId: string) => {
    return expenses
      .filter((e) => e.category === categoryId)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Categories</h2>
          <button className="text-indigo-600 hover:text-indigo-800">
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              selectedCategory === null
                ? 'bg-indigo-50 text-indigo-700'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-3 text-gray-400" />
                <span className="font-medium">All Categories</span>
              </div>
              <span className="text-sm text-gray-500">
                ${expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
              </span>
            </div>
          </button>

          {categories.map((category) => {
            const Icon = getCategoryIcon(category.id);
            const total = getCategoryTotal(category.id);
            const limit = category.limit || Infinity;
            const percentUsed = (total / limit) * 100;

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <span className="font-medium">{category.name}</span>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    ${total.toLocaleString()}
                  </span>
                </div>

                {category.limit && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 flex justify-between mb-1">
                      <span>Budget</span>
                      <span>
                        ${total.toLocaleString()} / ${category.limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          percentUsed >= 90
                            ? 'bg-red-500'
                            : percentUsed >= 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentUsed, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {category.requiresReceipt && (
                  <div className="mt-2 text-xs text-gray-500">
                    • Receipt required
                  </div>
                )}
                {category.requiresApproval && (
                  <div className="text-xs text-gray-500">
                    • Pre-approval required
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};