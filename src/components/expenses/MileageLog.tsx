import React, { useState } from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { calculateMileage, formatCurrency } from '../../utils/expenseUtils';
import { format } from 'date-fns';
import { Car, Download, Plus, MapPin } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

interface MileageEntry {
  date: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  purpose: string;
}

export const MileageLog = () => {
  const [entries, setEntries] = useState<MileageEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<MileageEntry>({
    date: format(new Date(), 'yyyy-MM-dd'),
    startLocation: '',
    endLocation: '',
    distance: 0,
    purpose: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEntries([...entries, formData]);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      startLocation: '',
      endLocation: '',
      distance: 0,
      purpose: '',
    });
    setShowForm(false);
    toast.success('Mileage entry added successfully');
  };

  const handleExport = () => {
    const data = [
      ['Mileage Log - IRD Compliant Record'],
      ['For tax year ending 31 March 2024'],
      [''],
      ['Date', 'From', 'To', 'Distance (km)', 'Purpose', 'Amount'],
      ...entries.map((entry) => [
        format(new Date(entry.date), 'dd/MM/yyyy'),
        entry.startLocation,
        entry.endLocation,
        entry.distance,
        entry.purpose,
        formatCurrency(calculateMileage(entry.distance)),
      ]),
      [''],
      ['Total Distance (km)', entries.reduce((sum, entry) => sum + entry.distance, 0)],
      [
        'Total Amount',
        formatCurrency(
          entries.reduce((sum, entry) => sum + calculateMileage(entry.distance), 0)
        ),
      ],
      [''],
      ['Rate per kilometer', '$0.83 (IRD rate for 2024)'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mileage Log');
    XLSX.writeFile(wb, `mileage-log-${format(new Date(), 'yyyy-MM')}.xlsx`);
    toast.success('Mileage log exported successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Mileage Log</h2>
          <p className="text-sm text-gray-500">IRD compliant vehicle expense records</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Entry</span>
          </button>
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Distance (km)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) =>
                    setFormData({ ...formData, distance: parseFloat(e.target.value) })
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.startLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, startLocation: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.endLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, endLocation: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Purpose
              </label>
              <input
                type="text"
                required
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                className="input-field"
                placeholder="e.g., Client meeting, Site visit"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Add Entry
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Distance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purpose
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {format(new Date(entry.date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {entry.startLocation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {entry.endLocation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {entry.distance} km
                </td>
                <td className="px-6 py-4 text-sm">{entry.purpose}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatCurrency(calculateMileage(entry.distance))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {entries.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No mileage entries yet. Add your first entry to get started.
          </div>
        )}
      </div>

      {entries.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Distance</p>
              <p className="text-xl font-bold">
                {entries.reduce((sum, entry) => sum + entry.distance, 0)} km
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-bold">
                {formatCurrency(
                  entries.reduce(
                    (sum, entry) => sum + calculateMileage(entry.distance),
                    0
                  )
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <Car className="text-blue-600 mt-0.5 mr-2" size={16} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">IRD Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Keep accurate records of business travel</li>
              <li>Record date, distance, and purpose of each trip</li>
              <li>Current mileage rate: $0.83 per kilometer</li>
              <li>Retain records for 7 years</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};