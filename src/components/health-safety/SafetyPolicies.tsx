import React, { useState } from 'react';
import { FileText, Download, AlertCircle, Plus } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

interface Policy {
  id: string;
  name: string;
  description: string;
  lastReviewed: string;
  nextReview: string;
  status: 'active' | 'under_review' | 'archived';
  acknowledgments: string[];
}

export const SafetyPolicies = () => {
  const [policies] = useState<Policy[]>([
    {
      id: '1',
      name: 'Health & Safety Policy',
      description: 'Overall workplace health and safety guidelines',
      lastReviewed: '2024-02-01',
      nextReview: '2024-08-01',
      status: 'active',
      acknowledgments: ['emp1', 'emp2'],
    },
    {
      id: '2',
      name: 'Emergency Response Plan',
      description: 'Procedures for various emergency situations',
      lastReviewed: '2024-01-15',
      nextReview: '2024-07-15',
      status: 'active',
      acknowledgments: ['emp1'],
    },
    {
      id: '3',
      name: 'Hazard Management',
      description: 'Identification and control of workplace hazards',
      lastReviewed: '2024-02-15',
      nextReview: '2024-08-15',
      status: 'active',
      acknowledgments: ['emp1', 'emp2', 'emp3'],
    },
  ]);

  const handleDownload = (policy: Policy) => {
    // In a real app, this would download the actual policy document
    toast.success(`Downloading ${policy.name}`);
  };

  const handleExport = () => {
    const data = [
      ['Safety Policies Register - WorkSafe NZ Compliant'],
      ['Generated:', format(new Date(), 'dd/MM/yyyy')],
      [''],
      ['Policy Name', 'Last Review', 'Next Review', 'Status', 'Acknowledgments'],
      ...policies.map(policy => [
        policy.name,
        format(new Date(policy.lastReviewed), 'dd/MM/yyyy'),
        format(new Date(policy.nextReview), 'dd/MM/yyyy'),
        policy.status.replace('_', ' ').toUpperCase(),
        policy.acknowledgments.length,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Safety Policies');
    XLSX.writeFile(wb, `safety-policies-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Policy register exported successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Safety Policies</h2>
            <p className="text-sm text-gray-500">WorkSafe NZ compliant documentation</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleExport}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Export Register</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Plus size={20} />
              <span>Add Policy</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <FileText className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="font-medium">{policy.name}</h3>
                  <p className="text-sm text-gray-500">{policy.description}</p>
                  <div className="flex items-center mt-2 space-x-4 text-sm">
                    <span className="text-gray-500">
                      Last Review: {format(new Date(policy.lastReviewed), 'MMM d, yyyy')}
                    </span>
                    <span className="text-gray-500">
                      Next Review: {format(new Date(policy.nextReview), 'MMM d, yyyy')}
                    </span>
                    <span className="text-gray-500">
                      Acknowledgments: {policy.acknowledgments.length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    policy.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : policy.status === 'under_review'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {policy.status.replace('_', ' ').toUpperCase()}
                </span>
                <button
                  onClick={() => handleDownload(policy)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">WorkSafe NZ Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Written health and safety policy required</li>
                <li>Regular review and updates needed</li>
                <li>Worker consultation mandatory</li>
                <li>All workers must be informed of policies</li>
                <li>Keep records of acknowledgments</li>
                <li>Policies must be easily accessible</li>
                <li>Emergency procedures clearly documented</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};