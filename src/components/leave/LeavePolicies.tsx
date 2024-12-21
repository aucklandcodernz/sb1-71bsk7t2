import React from 'react';
import { FileText, Calendar, Clock, AlertCircle } from 'lucide-react';

export const LeavePolicies = () => {
  const policies = [
    {
      title: 'Annual Leave',
      description: 'All employees are entitled to 4 weeks of annual leave after 12 months of continuous employment.',
      icon: Calendar,
      details: [
        'Leave must be taken at a time agreed between employer and employee',
        'Leave can be taken in advance by mutual agreement',
        'Payment is the greater of ordinary weekly pay or average weekly earnings',
        'Unused leave is paid out on termination',
      ],
    },
    {
      title: 'Sick Leave',
      description: 'Employees are entitled to 10 days of sick leave after 6 months of continuous employment.',
      icon: AlertCircle,
      details: [
        'Can be used for employee\'s illness or injury',
        'Can be used to care for dependents',
        'Medical certificate required for 3+ consecutive days',
        'Unused sick leave can accumulate up to 20 days',
      ],
    },
    {
      title: 'Public Holidays',
      description: 'Employees are entitled to 11 public holidays per year if they fall on days they would normally work.',
      icon: Clock,
      details: [
        'Time and a half for working on a public holiday',
        'Alternative day off if the holiday falls on a working day',
        'Public holidays cannot be included in annual leave',
        'Mondayisation applies to certain holidays',
      ],
    },
    {
      title: 'Bereavement Leave',
      description: 'Available after 6 months of continuous employment.',
      icon: FileText,
      details: [
        '3 days for immediate family members',
        '1 day for other bereavements (at employer\'s discretion)',
        'Can be taken at any time and for any purpose relating to the death',
        'Additional leave may be approved as annual leave or unpaid leave',
      ],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Leave Policies</h2>
        <p className="text-sm text-gray-500 mt-1">
          Based on NZ Employment Relations Act and Holidays Act
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {policies.map((policy) => {
            const Icon = policy.icon;
            return (
              <div key={policy.title} className="border rounded-lg p-6">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">{policy.title}</h3>
                    <p className="text-gray-600 mt-1">{policy.description}</p>
                    <ul className="mt-4 space-y-2">
                      {policy.details.map((detail, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 mr-2" />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};