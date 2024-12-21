import React, { useState } from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { X, Upload, Calculator } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { validateGSTNumber, calculateGST, calculateMileage, calculatePerDiem } from '../../utils/expenseUtils';

interface ExpenseFormProps {
  onClose: () => void;
}

export const ExpenseForm = ({ onClose }: ExpenseFormProps) => {
  const [uploading, setUploading] = useState(false);
  const { categories, addExpense } = useExpenseStore();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    description: '',
    receiptUrl: '',
    gstNumber: '',
    mileage: {
      distance: 0,
      rate: 0.83 // NZ IRD rate for 2024
    },
    perDiem: {
      days: 0,
      rate: 65 // Example rate for NZ domestic travel
    }
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setUploading(true);
      try {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFormData({
          ...formData,
          receiptUrl: URL.createObjectURL(acceptedFiles[0]),
        });
        toast.success('Receipt uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload receipt');
      } finally {
        setUploading(false);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate GST number if amount is over $50
    const amount = parseFloat(formData.amount);
    if (amount >= 50 && !validateGSTNumber(formData.gstNumber)) {
      toast.error('Valid GST number required for expenses over $50');
      return;
    }

    const expense = {
      employeeId: 'current-user', // In a real app, get from auth context
      date: formData.date,
      category: formData.category as any,
      amount,
      description: formData.description,
      receiptUrl: formData.receiptUrl,
      gstNumber: formData.gstNumber,
      status: 'pending',
      mileage: formData.category === 'travel' ? formData.mileage : undefined,
      perDiem: formData.category === 'travel' ? formData.perDiem : undefined,
    };

    addExpense(expense);
    toast.success('Expense submitted successfully');
    onClose();
  };

  const calculateTotal = () => {
    let total = parseFloat(formData.amount) || 0;
    
    if (formData.category === 'travel') {
      if (formData.mileage.distance > 0) {
        total += calculateMileage(formData.mileage.distance);
      }
      if (formData.perDiem.days > 0) {
        total += calculatePerDiem(formData.perDiem.days);
      }
    }

    return total;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Expense</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input-field pl-8"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            {formData.amount && (
              <p className="text-sm text-gray-500 mt-1">
                GST (15%): ${calculateGST(parseFloat(formData.amount)).toFixed(2)}
              </p>
            )}
          </div>

          {parseFloat(formData.amount) >= 50 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                GST Number
              </label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="input-field"
                placeholder="XXX-XXX-XXX"
                pattern="\d{3}-\d{3}-\d{3}"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: XXX-XXX-XXX (required for expenses over $50)
              </p>
            </div>
          )}

          {formData.category === 'travel' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mileage
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={formData.mileage.distance}
                    onChange={(e) => setFormData({
                      ...formData,
                      mileage: {
                        ...formData.mileage,
                        distance: parseFloat(e.target.value)
                      }
                    })}
                    className="input-field"
                    min="0"
                    placeholder="Distance (km)"
                  />
                  <div className="text-sm text-gray-500 pt-2">
                    ${(formData.mileage.distance * formData.mileage.rate).toFixed(2)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Per Diem
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={formData.perDiem.days}
                    onChange={(e) => setFormData({
                      ...formData,
                      perDiem: {
                        ...formData.perDiem,
                        days: parseInt(e.target.value)
                      }
                    })}
                    className="input-field"
                    min="0"
                    placeholder="Number of days"
                  />
                  <div className="text-sm text-gray-500 pt-2">
                    ${(formData.perDiem.days * formData.perDiem.rate).toFixed(2)}
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Describe the expense..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receipt
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'
              }`}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <div className="text-gray-600">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                  <p>Uploading...</p>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-sm text-gray-600">
                    {isDragActive
                      ? 'Drop the receipt here'
                      : 'Drag & drop receipt or click to select'}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold">${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Includes GST, mileage, and per diem if applicable
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Submit Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};