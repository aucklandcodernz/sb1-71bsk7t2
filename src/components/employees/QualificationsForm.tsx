import React, { useState } from 'react';
import { useEmployeeStore } from '../../store/employeeStore';
import { AlertCircle, Plus, X, FileText } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface QualificationsFormProps {
  employeeId: string;
  onClose: () => void;
}

export const QualificationsForm = ({ employeeId, onClose }: QualificationsFormProps) => {
  const employee = useEmployeeStore((state) => state.getEmployeeById(employeeId));
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);

  const [qualifications, setQualifications] = useState(
    employee?.qualifications || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateEmployee(employeeId, { qualifications });
      toast.success('Qualifications updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update qualifications');
    }
  };

  const addQualification = () => {
    setQualifications([
      ...qualifications,
      {
        id: Math.random().toString(36).substr(2, 9),
        type: '',
        name: '',
        institution: '',
        completionDate: '',
        expiryDate: '',
        verificationStatus: 'pending' as const
      }
    ]);
  };

  const removeQualification = (id: string) => {
    setQualifications(qualifications.filter(q => q.id !== id));
  };

  const updateQualification = (id: string, field: string, value: string) => {
    setQualifications(qualifications.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-6">Qualifications & Certifications</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {qualifications.map((qualification) => (
          <div key={qualification.id} className="border rounded-lg p-4 relative">
            <button
              type="button"
              onClick={() => removeQualification(qualification.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={qualification.type}
                  onChange={(e) => updateQualification(qualification.id, 'type', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="degree">Degree</option>
                  <option value="diploma">Diploma</option>
                  <option value="certificate">Certificate</option>
                  <option value="license">Professional License</option>
                  <option value="certification">Professional Certification</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name/Title
                </label>
                <input
                  type="text"
                  value={qualification.name}
                  onChange={(e) => updateQualification(qualification.id, 'name', e.target.value)}
                  className="input-field"
                  required
                  placeholder="e.g., Bachelor of Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Institution
                </label>
                <input
                  type="text"
                  value={qualification.institution}
                  onChange={(e) => updateQualification(qualification.id, 'institution', e.target.value)}
                  className="input-field"
                  required
                  placeholder="e.g., University of Auckland"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Completion Date
                </label>
                <input
                  type="date"
                  value={qualification.completionDate}
                  onChange={(e) => updateQualification(qualification.id, 'completionDate', e.target.value)}
                  className="input-field"
                  required
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date (if applicable)
                </label>
                <input
                  type="date"
                  value={qualification.expiryDate}
                  onChange={(e) => updateQualification(qualification.id, 'expiryDate', e.target.value)}
                  className="input-field"
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Verification Status
                </label>
                <select
                  value={qualification.verificationStatus}
                  onChange={(e) => updateQualification(qualification.id, 'verificationStatus', e.target.value)}
                  className="input-field"
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <input
                type="file"
                className="hidden"
                id={`qualification-${qualification.id}`}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label
                htmlFor={`qualification-${qualification.id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <FileText className="mr-2 h-5 w-5 text-gray-500" />
                Upload Document
              </label>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQualification}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <Plus size={20} className="mr-1" />
          Add Qualification
        </button>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Important Notes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Keep copies of all qualification documents</li>
                <li>Monitor expiry dates for certifications</li>
                <li>Verify qualifications with issuing institutions</li>
                <li>Update records when new qualifications are obtained</li>
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