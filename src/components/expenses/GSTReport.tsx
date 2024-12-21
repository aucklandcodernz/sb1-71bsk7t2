import React, { useState } from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { generateGSTReturn, formatCurrency } from '../../utils/expenseUtils';
import { format } from 'date-fns';
import { Download, FileText, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export const GSTReport = () => {
  const [period, setPeriod] = useState({
    start: format(new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1), 'yyyy-MM-dd'),
    end: format(new Date(new Date().getFullYear(), new Date().getMonth(), 0), 'yyyy-MM-dd'),
  });

  const { expenses } = useExpenseStore();
  const gstData = generateGSTReturn(expenses, period);

  const handleExport = () => {
    const data = [
      ['GST Return Summary', ''],
      ['Period', `${format(new Date(period.start), 'MMM d, yyyy')} - ${format(new Date(period.end), 'MMM d, yyyy')}`],
      ['', ''],
      ['Category', 'Amount', 'GST'],
      ...Object.entries(gstData.byCategory).map(([category, amount]) => [
        category,
        formatCurrency(amount),
        formatCurrency(amount * 0.15),
      ]),
      ['', '', ''],
      ['Total Sales/Income (Box 5)', formatCurrency(gstData.totalAmount), ''],
      ['Zero-rated Supplies (Box 6)', formatCurrency(gstData.summary.box6), ''],
      ['GST Charged (Box 7)', '', formatCurrency(gstData.summary.box7)],
      ['GST Credit/Payment (Box 9)', '', formatCurrency(gstData.summary.box9)],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'GST Return');
    XLSX.writeFile(wb, `gst-return-${format(new Date(period.start), 'yyyy-MM')}.xlsx`);
    toast.success('GST return exported successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">GST Return</h2>
          <p className="text-sm text-gray-500">NZ GST Return Summary</p>
        </div>
        <button
          onClick={handleExport}
          className="btn-secondary flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Export</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={period.start}
            onChange={(e) => setPeriod({ ...period, start: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={period.end}
            onChange={(e) => setPeriod({ ...period, end: e.target.value })}
            className="input-field"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">GST by Category</h3>
          <div className="space-y-2">
            {Object.entries(gstData.byCategory).map(([category, amount]) => (
              <div
                key={category}
                className="flex justify-between items-center py-2 border-b"
              >
                <span className="text-gray-600 capitalize">{category}</span>
                <div className="text-right">
                  <div>{formatCurrency(amount)}</div>
                  <div className="text-sm text-gray-500">
                    GST: {formatCurrency(amount * 0.15)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Sales/Income (Box 5)</p>
              <p className="text-xl font-bold">
                {formatCurrency(gstData.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total GST Collected (Box 9)</p>
              <p className="text-xl font-bold">
                {formatCurrency(gstData.totalGST)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">GST Filing Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>File GST returns every 2 months</li>
                <li>Keep all tax invoices for 7 years</li>
                <li>Include GST number on invoices over $50</li>
                <li>Report in NZD currency</li>
                <li>GST rate is 15%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};