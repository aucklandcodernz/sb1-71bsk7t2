import React, { useState } from 'react';
import { Book, Calendar, AlertCircle, Download, Plus } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

interface TrainingRecord {
  id: string;
  name: string;
  type: string;
  completionDate: string;
  expiryDate: string;
  provider: string;
  certificate?: string;
}

export const SafetyTraining = () => {
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState<TrainingRecord[]>([
    {
      id: '1',
      name: 'First Aid Level 2',
      type: 'certification',
      completionDate: '2024-01-15',
      expiryDate: '2025-01-15',
      provider: 'St John NZ',
    },
    {
      id: '2',
      name: 'Health & Safety Representative',
      type: 'certification',
      completionDate: '2024-02-01',
      expiryDate: '2025-02-01',
      provider: 'WorkSafe NZ',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'certification',
    completionDate: format(new Date(), 'yyyy-MM-dd'),
    provider: '',
    validityMonths: '12',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expiryDate = format(
      addMonths(new Date(formData.completionDate), parseInt(formData.validityMonths)),
      'yyyy-MM-dd'
    );

    setRecords([
      ...records,
      {
        id: Math.random().toString(36).substring(7),
        ...formData,
        expiryDate,
      },
    ]);

    setShowForm(false);
    toast.success('Training record added successfully');
  };

  const handleExport = () => {
    const data = [
      ['Training Records - WorkSafe NZ Compliant'],
      ['Generated:', format(new Date(), 'dd/MM/yyyy')],
      [''],
      ['Name', 'Type', 'Completion Date', 'Expiry Date', 'Provider'],
      ...records.map(record => [
        record.name,
        record.type,
        format(new Date(record.completionDate), 'dd/MM/yyyy'),
        format(new Date(record.expiryDate), 'dd/MM/yyyy'),
        record.provider,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Training Records');
    XLSX.writeFile(wb, `training-records-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Training records exported successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Safety Training</h2>
            <p className="text-sm text-gray-500">WorkSafe NZ compliant training records</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleExport}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Export Records</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Record</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {showForm && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Training Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-field"
                  >
                    <option value="certification">Certification</option>
                    <option value="induction">Induction</option>
                    <option value="refresher">Refresher</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.completionDate}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Validity (months)
                  </label>
                  <select
                    value={formData.validityMonths}
                    onChange={(e) => setFormData({ ...formData, validityMonths: e.target.value })}
                    className="input-field"
                  >
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Training Provider
                </label>
                <input
                  type="text"
                  required
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="input-field"
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
                  Add Record
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => {
            const isExpiring = new Date(record.expiryDate) <= addMonths(new Date(), 3);
            const isExpired = new Date(record.expiryDate) <= new Date();

            return (
              <div
                key={record.id}
                className={`border rounded-lg p-4 ${
                  isExpired
                    ? 'bg-red-50 border-red-200'
                    : isExpiring
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{record.name}</h3>
                    <p className="text-sm text-gray-500">{record.provider}</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <Book
                      className={
                        isExpired
                          ? 'text-red-500'
                          : isExpiring
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }
                      size={20}
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Completed</p>
                    <p className="font-medium">
                      {format(new Date(record.completionDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Expires</p>
                    <p className="font-medium">
                      {format(new Date(record.expiryDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                {(isExpired || isExpiring) && (
                  <div className="mt-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        isExpired
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {isExpired ? 'Renewal Required' : 'Renewal Due Soon'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">WorkSafe NZ Training Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Health & Safety Representative training required</li>
                <li>First Aid certificates must be current</li>
                <li>Site-specific inductions mandatory</li>
                <li>Regular refresher training needed</li>
                <li>Keep training records for 7 years</li>
                <li>Monitor certification expiry dates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};