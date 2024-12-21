import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { useEmployeeStore } from '../../store/employeeStore';
import { Employee } from '../../types';
import { format } from 'date-fns';
import { validateIRDNumber, validateBankAccount } from '../../utils/payrollUtils';

interface EmployeeFormProps {
  onClose: () => void;
  employee?: Employee;
}

interface FormErrors {
  [key: string]: string;
}

export const EmployeeForm = ({ onClose, employee }: EmployeeFormProps) => {
  const addEmployee = useEmployeeStore((state) => state.addEmployee);
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);

  const [formData, setFormData] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    position: employee?.position || '',
    department: employee?.department || '',
    startDate: employee?.startDate || format(new Date(), 'yyyy-MM-dd'),
    salary: employee?.salary || '',
    phoneNumber: employee?.phoneNumber || '',
    emergencyContact: employee?.emergencyContact || '',
    address: employee?.address || '',
    taxCode: employee?.taxCode || '',
    kiwiSaverRate: employee?.kiwiSaverRate || '3',
    bankAccount: employee?.bankAccount || '',
    irdNumber: employee?.irdNumber || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.phoneNumber && !/^\+?[\d\s-]{8,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    if (formData.bankAccount && !validateBankAccount(formData.bankAccount)) {
      newErrors.bankAccount = 'Invalid bank account format (XX-XXXX-XXXXXXX-XX)';
    }

    if (formData.irdNumber && !validateIRDNumber(formData.irdNumber)) {
      newErrors.irdNumber = 'Invalid IRD number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (employee) {
        updateEmployee(employee.id, {
          ...formData,
          status: employee.status,
        });
      } else {
        addEmployee({
          id: Math.random().toString(36).substr(2, 9),
          ...formData,
          status: 'active',
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      setErrors({
        submit: 'Failed to save employee. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle size={20} className="mr-2" />
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                placeholder="John Smith"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="john.smith@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className={`input-field ${errors.position ? 'border-red-500' : ''}`}
                placeholder="Software Engineer"
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className={`input-field ${errors.department ? 'border-red-500' : ''}`}
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Customer Support">Customer Support</option>
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={`input-field ${errors.startDate ? 'border-red-500' : ''}`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={`input-field ${errors.phoneNumber ? 'border-red-500' : ''}`}
                placeholder="+64 XX XXX XXXX"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="input-field"
                placeholder="Name: XXX, Phone: XXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field"
                placeholder="Full address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Code
              </label>
              <select
                value={formData.taxCode}
                onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                className="input-field"
              >
                <option value="">Select Tax Code</option>
                <option value="M">M (Main employment)</option>
                <option value="S">S (Secondary employment)</option>
                <option value="SH">SH (Secondary higher rate)</option>
                <option value="ST">ST (Secondary tax rate)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                KiwiSaver Rate
              </label>
              <select
                value={formData.kiwiSaverRate}
                onChange={(e) => setFormData({ ...formData, kiwiSaverRate: e.target.value })}
                className="input-field"
              >
                <option value="3">3%</option>
                <option value="4">4%</option>
                <option value="6">6%</option>
                <option value="8">8%</option>
                <option value="10">10%</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Account
              </label>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className={`input-field ${errors.bankAccount ? 'border-red-500' : ''}`}
                placeholder="XX-XXXX-XXXXXXX-XX"
              />
              {errors.bankAccount && (
                <p className="mt-1 text-sm text-red-600">{errors.bankAccount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IRD Number
              </label>
              <input
                type="text"
                value={formData.irdNumber}
                onChange={(e) => setFormData({ ...formData, irdNumber: e.target.value })}
                className={`input-field ${errors.irdNumber ? 'border-red-500' : ''}`}
                placeholder="XXX-XXX-XXX"
              />
              {errors.irdNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.irdNumber}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center"
              disabled={isSubmitting}
            >
              <Save size={20} className="mr-2" />
              {isSubmitting ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};