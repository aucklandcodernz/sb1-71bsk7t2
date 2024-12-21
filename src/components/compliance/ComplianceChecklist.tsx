import React from 'react';
import { useNZComplianceStore } from '../../store/nzComplianceStore';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ComplianceChecklistProps {
  employeeId: string;
}

export const ComplianceChecklist = ({ employeeId }: ComplianceChecklistProps) => {
  const report = useNZComplianceStore((state) => state.generateComplianceReport(employeeId));

  const checklistItems = [
    {
      title: 'Employment Agreement',
      description: 'Valid and signed employment contract',
      status: report.agreements,
      critical: true,
    },
    {
      title: 'Leave Entitlements',
      description: 'Annual, sick, and other leave types configured',
      status: report.leave,
      critical: true,
    },
    {
      title: 'Payroll Setup',
      description: 'Tax codes, KiwiSaver, and bank details',
      status: report.payroll,
      critical: true,
    },
    {
      title: 'Health & Safety',
      description: 'Induction and training records',
      status: report.healthSafety,
      critical: false,
    },
    {
      title: 'Policy Acknowledgments',
      description: 'Required policies reviewed and signed',
      status: report.policies,
      critical: false,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Compliance Checklist</h2>
        <p className="text-sm text-gray-500 mt-1">NZ Employment Requirements</p>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {checklistItems.map((item) => (
            <div
              key={item.title}
              className={`flex items-start justify-between p-4 rounded-lg border ${
                item.critical && !item.status
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-medium">{item.title}</h3>
                  {item.critical && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
              <div className="ml-4">
                {item.status ? (
                  <CheckCircle className="text-green-500" size={24} />
                ) : item.critical ? (
                  <AlertCircle className="text-red-500" size={24} />
                ) : (
                  <XCircle className="text-gray-400" size={24} />
                )}
              </div>
            </div>
          ))}
        </div>

        {checklistItems.some((item) => item.critical && !item.status) && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <AlertCircle className="text-red-600 mt-0.5 mr-2" size={16} />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Critical Requirements Missing
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  Some mandatory compliance requirements need attention. Please complete
                  these to ensure NZ employment law compliance.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};