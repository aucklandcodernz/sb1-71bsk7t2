import React, { useState } from 'react';
import { AlertTriangle, X, Plus } from 'lucide-react';
import { useHealthSafetyStore } from '../../store/healthSafetyStore';
import { HAZARD_CATEGORIES, RISK_MATRIX, calculateRiskScore } from '../../utils/healthSafetyUtils';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';

interface HazardFormProps {
  onClose: () => void;
}

export const HazardForm = ({ onClose }: HazardFormProps) => {
  const [formData, setFormData] = useState({
    type: Object.values(HAZARD_CATEGORIES)[0],
    location: '',
    description: '',
    identifiedBy: '',
    risk: 'low' as const,
    likelihood: RISK_MATRIX.LIKELIHOOD[0],
    consequence: RISK_MATRIX.CONSEQUENCE[0],
    controls: [''],
    reviewDate: format(addDays(new Date(), 90), 'yyyy-MM-dd'), // 90-day review cycle
    status: 'active' as const,
  });

  const addHazard = useHealthSafetyStore((state) => state.addHazard);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const riskScore = calculateRiskScore(formData.likelihood, formData.consequence);
    
    try {
      addHazard({
        ...formData,
        controls: formData.controls.filter(Boolean),
        risk: riskScore >= 16 ? 'critical' : riskScore >= 10 ? 'high' : riskScore >= 5 ? 'medium' : 'low',
      });
      
      toast.success('Hazard reported successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to report hazard');
    }
  };

  const addControl = () => {
    setFormData({
      ...formData,
      controls: [...formData.controls, ''],
    });
  };

  const updateControl = (index: number, value: string) => {
    const newControls = [...formData.controls];
    newControls[index] = value;
    setFormData({
      ...formData,
      controls: newControls,
    });
  };

  const removeControl = (index: number) => {
    setFormData({
      ...formData,
      controls: formData.controls.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Report Hazard</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hazard Type
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
              >
                {Object.values(HAZARD_CATEGORIES).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
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
                placeholder="Where is the hazard located?"
              />
            </div>
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
              rows={3}
              placeholder="Describe the hazard in detail..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Likelihood
              </label>
              <select
                required
                value={formData.likelihood}
                onChange={(e) => setFormData({ ...formData, likelihood: e.target.value })}
                className="input-field"
              >
                {RISK_MATRIX.LIKELIHOOD.map((level) => (
                  <option key={level} value={level}>
                    {level.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Consequence
              </label>
              <select
                required
                value={formData.consequence}
                onChange={(e) => setFormData({ ...formData, consequence: e.target.value })}
                className="input-field"
              >
                {RISK_MATRIX.CONSEQUENCE.map((level) => (
                  <option key={level} value={level}>
                    {level.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Control Measures
            </label>
            <div className="space-y-2">
              {formData.controls.map((control, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={control}
                    onChange={(e) => updateControl(index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="Add control measure"
                  />
                  <button
                    type="button"
                    onClick={() => removeControl(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addControl}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Add Control Measure
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Review Date
            </label>
            <input
              type="date"
              required
              value={formData.reviewDate}
              onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
              className="input-field"
              min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Identified By
            </label>
            <input
              type="text"
              required
              value={formData.identifiedBy}
              onChange={(e) => setFormData({ ...formData, identifiedBy: e.target.value })}
              className="input-field"
              placeholder="Your name"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="text-blue-600 mt-0.5 mr-2" size={16} />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Hierarchy of Controls:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Elimination - Remove the hazard</li>
                  <li>Substitution - Replace the hazard</li>
                  <li>Engineering controls - Isolate people from the hazard</li>
                  <li>Administrative controls - Change the way people work</li>
                  <li>PPE - Protect the worker with personal protective equipment</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center">
              <AlertTriangle size={20} className="mr-2" />
              Report Hazard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};