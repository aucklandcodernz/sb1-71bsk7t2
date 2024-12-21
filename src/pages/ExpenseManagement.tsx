import React, { useState } from 'react';
import { useExpenseStore } from '../store/expenseStore';
import { Plus, Filter, Download, Search } from 'lucide-react';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { ExpenseStats } from '../components/expenses/ExpenseStats';
import { ExpenseCategories } from '../components/expenses/ExpenseCategories';
import { GSTReport } from '../components/expenses/GSTReport';
import { MileageLog } from '../components/expenses/MileageLog';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const ExpenseManagement = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'expenses' | 'gst' | 'mileage'>('expenses');
  const [dateRange, setDateRange] = useState({
    start: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });

  const { expenses } = useExpenseStore();

  const handleExport = () => {
    const data = expenses.map(expense => ({
      'Date': format(new Date(expense.date), 'dd/MM/yyyy'),
      'Category': expense.category,
      'Description': expense.description,
      'Amount': expense.amount,
      'Status': expense.status,
      'GST': (expense.amount * 0.15).toFixed(2), // NZ GST rate 15%
      'Net Amount': (expense.amount * 0.85).toFixed(2)
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    XLSX.writeFile(wb, `expenses-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Expenses exported successfully');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-500">Track and manage employee expenses</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowExpenseForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      <ExpenseStats />

      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'expenses'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('gst')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'gst'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            GST Report
          </button>
          <button
            onClick={() => setActiveTab('mileage')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'mileage'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Mileage Log
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'expenses' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search expenses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  </div>
                  <div className="flex space-x-4">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, start: e.target.value })
                      }
                      className="input-field"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, end: e.target.value })
                      }
                      className="input-field"
                    />
                    <button className="btn-secondary flex items-center space-x-2">
                      <Filter size={20} />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>
              </div>
              <ExpenseList
                selectedCategory={selectedCategory}
                dateRange={dateRange}
                searchQuery={searchQuery}
              />
            </div>
          )}

          {activeTab === 'gst' && <GSTReport />}
          {activeTab === 'mileage' && <MileageLog />}
        </div>

        <div className="space-y-6">
          <ExpenseCategories
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">GST Information</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• NZ GST Rate: 15%</p>
              <p>• GST Number required for expenses over $50</p>
              <p>• Keep receipts for 7 years</p>
              <p>• File GST returns every 2 months</p>
            </div>
          </div>
        </div>
      </div>

      {showExpenseForm && (
        <ExpenseForm onClose={() => setShowExpenseForm(false)} />
      )}
    </div>
  );
};

export default ExpenseManagement;