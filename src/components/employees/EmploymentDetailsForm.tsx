import React, { useState } from 'react';
import { useEmployeeStore } from '../../store/employeeStore';
import { AlertCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface EmploymentDetailsFormProps {
  employeeId: string;
  onClose: () => void;
}

export const EmploymentDetailsForm = ({ employeeId, onClose }: EmploymentDetailsFormProps) => {
  const employee = useEmployeeStore((state) => state.getEmployeeById(employeeId));
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);

  const [formData, setFormData] = useState({
    employmentDetails: {
      employmentType: employee?.employmentDetails?.employmentType || 'full_time',
      contractEndDate: employee?.employmentDetails?.contractEndDate || '',
      probationEndDate: employee?.employmentDetails?.probationEndDate || '',
      workingHours: employee?.employmentDetails?.workingHours || {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: ''
      },
      location: employee?.employmentDetails?.location || '',
      manager: employee?.employmentDetails?.manager || '',
      department: employee?.employmentDetails?.department || '',
      team: employee?.employmentDetails?.team || ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateEmployee(employeeId, formData);
      toast.success('Employment details updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update employment details');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-6">Employment Details</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employment Type
            </label>
            <select
              value={formData.employmentDetails.employmentType}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                employmentDetails: {
                  ...prev.employmentDetails,
                  employmentType: e.target.value as any
                }
              }))}
              className="input-field"
              required
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="casual">Casual</option>
              <option value="fixed_term">Fixed Term</option>
            </select>
          </div>

          {formData.employmentDetails.employmentType === 'fixed_term' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contract End Date
              </label>
              <input
                type="date"
                value={formData.employmentDetails.contractEndDate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  employmentDetails: {
                    ...prev.employmentDetails,
                    contractEndDate: e.target.value
                  }
                }))}
                className="input-field"
                min={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Probation End Date
            </label>
            <input
              type="date"
              value={formData.employmentDetails.probationEndDate}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                employmentDetails: {
                  ...prev.employmentDetails,
                  probationEndDate: e.target.value
                }
              }))}
              className="input-field"
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={formData.employmentDetails.location}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                employmentDetails: {
                  ...prev.employmentDetails,
                  location: e.target.value
                }
              }))}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              type="text"
              value={formData.employmentDetails.department}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                employmentDetails: {
                  ...prev.employmentDetails,
                  department: e.target.value
                }
              }))}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Team
            </label>
            <input
              type="text"
              value={formData.employmentDetails.team}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                employmentDetails: {
                  ...prev.employmentDetails,
                  team: e.target.value
                }
              }))}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manager
            </label>
            <input
              type="text"
              value={formData.employmentDetails.manager}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                employmentDetails: {
                  ...prev.employmentDetails,
                  manager: e.target.value
                }
              }))}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <Clock size={16} className="mr-2" />
            Working Hours
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.employmentDetails.workingHours).map(([day, hours]) => (
              <div key={day}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {day}
                </label>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    employmentDetails: {
                      ...prev.employmentDetails,
                      workingHours: {
                        ...prev.employmentDetails.workingHours,
                        [day]: e.target.value
                      }
                    }
                  }))}
                  className="input-field"
                  placeholder="e.g., 9:00-17:00"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">NZ Employment Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Maximum 90-day trial period for eligible employers</li>
                <li>Minimum rest and meal breaks required</li>
                <li>Record keeping requirements under Employment Relations Act</li>
                <li>Regular review of employment terms</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};