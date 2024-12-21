import React, { useState } from 'react';
import { useHealthSafetyStore } from '../../store/healthSafetyStore';
import { AlertTriangle, Shield, Clock, Download, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { HAZARD_CATEGORIES, RISK_MATRIX, getRiskLevel } from '../../utils/healthSafetyUtils';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export const HazardList = () => {
  const { hazards, updateHazard } = useHealthSafetyStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleStatusChange = (id: string, status: 'active' | 'mitigated') => {
    updateHazard(id, { status });
    toast.success(`Hazard marked as ${status}`);
  };

  const handleExport = () => {
    const data = [
      ['Hazard Register - WorkSafe NZ Compliant'],
      ['Generated:', format(new Date(), 'dd/MM/yyyy')],
      [''],
      ['Type', 'Location', 'Risk Level', 'Controls', 'Review Date', 'Status'],
      ...hazards.map(hazard => [
        hazard.type,
        hazard.location,
        hazard.risk,
        hazard.controls.join(', '),
        format(new Date(hazard.reviewDate), 'dd/MM/yyyy'),
        hazard.status
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hazard Register');
    XLSX.writeFile(wb, `hazard-register-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Hazard register exported successfully');
  };

  const filteredHazards = selectedCategory
    ? hazards.filter(hazard => hazard.type === selectedCategory)
    : hazards;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {Object.values(HAZARD_CATEGORIES).map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export Register</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHazards.map((hazard) => (
          <div
            key={hazard.id}
            className={`bg-white rounded-lg shadow p-6 ${
              hazard.status === 'mitigated' ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{hazard.type}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                      hazard.risk
                    )}`}
                  >
                    {hazard.risk.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Location: {hazard.location}
                </p>
              </div>
              <button
                onClick={() =>
                  handleStatusChange(
                    hazard.id,
                    hazard.status === 'active' ? 'mitigated' : 'active'
                  )
                }
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  hazard.status === 'active'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {hazard.status === 'active' ? 'Active' : 'Mitigated'}
              </button>
            </div>

            {hazard.controls.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Control Measures:</h4>
                <ul className="space-y-2">
                  {hazard.controls.map((control, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Shield size={16} className="text-green-500 mr-2" />
                      {control}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                Review due: {format(new Date(hazard.reviewDate), 'MMM d, yyyy')}
              </div>
              <span>ID: {hazard.identifiedBy}</span>
            </div>
          </div>
        ))}
      </div>

      {hazards.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hazards reported. Click "Report Hazard" to add one.
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="text-blue-600 mt-0.5 mr-2" size={16} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">WorkSafe NZ Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Identify and assess workplace hazards</li>
              <li>Implement control measures using hierarchy of controls</li>
              <li>Regular review and monitoring required</li>
              <li>Maintain hazard register</li>
              <li>Consult with workers on hazard management</li>
              <li>Train workers on hazard identification and controls</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};