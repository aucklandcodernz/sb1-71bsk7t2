import React, { useState } from 'react';
import { AlertTriangle, X, Upload } from 'lucide-react';
import { useHealthSafetyStore } from '../../store/healthSafetyStore';
import { SEVERITY_LEVELS, isNotifiableIncident } from '../../utils/healthSafetyUtils';
import toast from 'react-hot-toast';

interface IncidentFormProps {
  onClose: () => void;
}

export const IncidentForm = ({ onClose }: IncidentFormProps) => {
  const [formData, setFormData] = useState({
    type: 'near_miss' as const,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(':').slice(0, 2).join(':'),
    location: '',
    description: '',
    injuryType: '',
    treatmentRequired: false,
    reportedBy: '',
    reporterRole: '',
    reporterContact: '',
    severity: SEVERITY_LEVELS.NEAR_MISS,
    worksafeNotified: false,
    witnesses: [''],
    actions: [
      {
        description: '',
        assignee: '',
        dueDate: '',
        completed: false,
      },
    ],
    attachments: [] as File[],
  });

  const addIncident = useHealthSafetyStore((state) => state.addIncident);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNotifiable = isNotifiableIncident({
      ...formData,
      description: formData.description + ' ' + formData.injuryType,
    });

    if (isNotifiable && !formData.worksafeNotified) {
      if (!confirm('This incident requires WorkSafe NZ notification. Continue?')) {
        return;
      }
    }

    try {
      await addIncident({
        ...formData,
        status: 'investigating',
        actions: formData.actions.filter((action) => action.description && action.assignee),
        witnesses: formData.witnesses.filter(Boolean),
      });

      if (isNotifiable) {
        toast.success('Incident reported. Please notify WorkSafe NZ within 24 hours.');
      } else {
        toast.success('Incident reported successfully');
      }

      onClose();
    } catch (error) {
      toast.error('Failed to report incident');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Report Incident</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Incident Type
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="input-field"
              >
                <option value="near_miss">Near Miss</option>
                <option value="minor">Minor Incident</option>
                <option value="serious">Serious Incident</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Severity
              </label>
              <select
                required
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                className="input-field"
              >
                {Object.values(SEVERITY_LEVELS).map((level) => (
                  <option key={level} value={level}>
                    {level.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="input-field"
              placeholder="Where did the incident occur?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={4}
              placeholder="Describe what happened in detail..."
            />
          </div>

          {formData.type !== 'near_miss' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Injury Type
                </label>
                <input
                  type="text"
                  value={formData.injuryType}
                  onChange={(e) => setFormData({ ...formData, injuryType: e.target.value })}
                  className="input-field"
                  placeholder="Type of injury if applicable"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="treatment"
                  checked={formData.treatmentRequired}
                  onChange={(e) =>
                    setFormData({ ...formData, treatmentRequired: e.target.checked })
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="treatment" className="ml-2 text-sm text-gray-700">
                  Medical treatment required
                </label>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reported By
              </label>
              <input
                type="text"
                required
                value={formData.reportedBy}
                onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                className="input-field"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                type="text"
                required
                value={formData.reporterRole}
                onChange={(e) => setFormData({ ...formData, reporterRole: e.target.value })}
                className="input-field"
                placeholder="Your role"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Details
            </label>
            <input
              type="text"
              required
              value={formData.reporterContact}
              onChange={(e) => setFormData({ ...formData, reporterContact: e.target.value })}
              className="input-field"
              placeholder="Phone or email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Upload size={20} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  Upload photos or documents
                </span>
              </label>
            </div>
            {formData.attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {formData.severity === SEVERITY_LEVELS.NOTIFIABLE && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="text-red-600 mt-0.5 mr-2" size={16} />
                <div>
                  <h4 className="text-sm font-medium text-red-800">
                    WorkSafe NZ Notification Required
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    This incident must be reported to WorkSafe NZ within 24 hours.
                  </p>
                  <a
                    href="https://www.worksafe.govt.nz/notify-worksafe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-red-600 hover:text-red-800 mt-2 inline-block"
                  >
                    Go to WorkSafe NZ Notification Form
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center">
              <AlertTriangle size={20} className="mr-2" />
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};