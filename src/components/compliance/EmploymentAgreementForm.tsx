import React, { useState } from 'react';
import { FileText, X } from 'lucide-react';
import { useNZComplianceStore } from '../../store/nzComplianceStore';

interface EmploymentAgreementFormProps {
  employeeId: string;
  onClose: () => void;
}

export const EmploymentAgreementForm = ({ employeeId, onClose }: EmploymentAgreementFormProps) => {
  const [formData, setFormData] = useState({
    type: 'individual',
    startDate: '',
    trialPeriod: {
      enabled: false,
      duration: 90,
    },
    terms: {
      hoursOfWork: '',
      workLocation: '',
      salary: '',
      leaveEntitlements: '4 weeks annual leave, 10 days sick leave',
      publicHolidays: 'As per Holidays Act 2003',
      notice: '4 weeks',
    },
  });

  const createEmploymentAgreement = useNZComplianceStore(
    (state) => state.createEmploymentAgreement
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEmploymentAgreement(employeeId, {
      ...formData,
      status: 'active',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">New Employment Agreement</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Agreement Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as any })
              }
              className="input-field"
            >
              <option value="individual">Individual Agreement</option>
              <option value="collective">Collective Agreement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="input-field"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.trialPeriod.enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trialPeriod: {
                      ...formData.trialPeriod,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Include 90-day trial period
              </span>
            </label>
            {formData.trialPeriod.enabled && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
                Note: 90-day trial periods are only valid for employers with fewer
                than 20 employees
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Employment Terms</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hours of Work
              </label>
              <input
                type="text"
                value={formData.terms.hoursOfWork}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    terms: { ...formData.terms, hoursOfWork: e.target.value },
                  })
                }
                className="input-field"
                placeholder="e.g., Monday to Friday, 9am to 5pm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Work Location
              </label>
              <input
                type="text"
                value={formData.terms.workLocation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    terms: { ...formData.terms, workLocation: e.target.value },
                  })
                }
                className="input-field"
                placeholder="Primary place of work"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Salary/Wage
              </label>
              <input
                type="text"
                value={formData.terms.salary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    terms: { ...formData.terms, salary: e.target.value },
                  })
                }
                className="input-field"
                placeholder="Annual salary or hourly rate"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notice Period
              </label>
              <input
                type="text"
                value={formData.terms.notice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    terms: { ...formData.terms, notice: e.target.value },
                  })
                }
                className="input-field"
                placeholder="e.g., 4 weeks"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center"
            >
              <FileText size={20} className="mr-2" />
              Generate Agreement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};