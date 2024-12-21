import React, { useState } from 'react';
import { useEmployeeStore } from '../../store/employeeStore';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface PersonalDetailsFormProps {
  employeeId: string;
  onClose: () => void;
}

export const PersonalDetailsForm = ({ employeeId, onClose }: PersonalDetailsFormProps) => {
  const employee = useEmployeeStore((state) => state.getEmployeeById(employeeId));
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);

  const [formData, setFormData] = useState({
    personalDetails: {
      dateOfBirth: employee?.personalDetails?.dateOfBirth || '',
      gender: employee?.personalDetails?.gender || '',
      nationality: employee?.personalDetails?.nationality || '',
      passportNumber: employee?.personalDetails?.passportNumber || '',
      passportExpiry: employee?.personalDetails?.passportExpiry || '',
      visaType: employee?.personalDetails?.visaType || '',
      visaExpiry: employee?.personalDetails?.visaExpiry || '',
      nzResidencyStatus: employee?.personalDetails?.nzResidencyStatus || 'other'
    },
    emergencyContacts: employee?.emergencyContacts || [{
      name: '',
      relationship: '',
      phoneNumber: '',
      email: '',
      address: ''
    }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateEmployee(employeeId, formData);
      toast.success('Personal details updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update personal details');
    }
  };

  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        {
          name: '',
          relationship: '',
          phoneNumber: '',
          email: '',
          address: ''
        }
      ]
    }));
  };

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      emergencyContacts: newContacts
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-6">Personal Details</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.personalDetails.dateOfBirth}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personalDetails: {
                  ...prev.personalDetails,
                  dateOfBirth: e.target.value
                }
              }))}
              className="input-field"
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              value={formData.personalDetails.gender}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personalDetails: {
                  ...prev.personalDetails,
                  gender: e.target.value
                }
              }))}
              className="input-field"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nationality
            </label>
            <input
              type="text"
              value={formData.personalDetails.nationality}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personalDetails: {
                  ...prev.personalDetails,
                  nationality: e.target.value
                }
              }))}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              NZ Residency Status
            </label>
            <select
              value={formData.personalDetails.nzResidencyStatus}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personalDetails: {
                  ...prev.personalDetails,
                  nzResidencyStatus: e.target.value as any
                }
              }))}
              className="input-field"
            >
              <option value="citizen">NZ Citizen</option>
              <option value="permanent_resident">Permanent Resident</option>
              <option value="work_visa">Work Visa</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {formData.personalDetails.nzResidencyStatus === 'work_visa' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Visa Type
              </label>
              <input
                type="text"
                value={formData.personalDetails.visaType}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  personalDetails: {
                    ...prev.personalDetails,
                    visaType: e.target.value
                  }
                }))}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Visa Expiry
              </label>
              <input
                type="date"
                value={formData.personalDetails.visaExpiry}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  personalDetails: {
                    ...prev.personalDetails,
                    visaExpiry: e.target.value
                  }
                }))}
                className="input-field"
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Emergency Contacts</h4>
          {formData.emergencyContacts.map((contact, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={contact.relationship}
                    onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contact.phoneNumber}
                    onChange={(e) => updateEmergencyContact(index, 'phoneNumber', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => updateEmergencyContact(index, 'email', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    value={contact.address}
                    onChange={(e) => updateEmergencyContact(index, 'address', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addEmergencyContact}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            + Add Emergency Contact
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Important Notes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Keep emergency contact details up to date</li>
                <li>Monitor visa expiry dates</li>
                <li>Ensure compliance with Privacy Act 2020</li>
                <li>Maintain accurate records for 7 years</li>
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