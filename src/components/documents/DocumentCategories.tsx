import React from 'react';
import { useDocumentStore } from '../../store/documentStore';
import { FileText, Users, Shield, Book, DollarSign } from 'lucide-react';

export const DocumentCategories = () => {
  const { getDocumentsByType } = useDocumentStore();

  const categories = [
    {
      id: 'contract',
      name: 'Employment Agreements',
      icon: Users,
      description: 'Individual and collective agreements',
      count: getDocumentsByType('contract').length,
    },
    {
      id: 'policy',
      name: 'Company Policies',
      icon: Shield,
      description: 'Internal policies and procedures',
      count: getDocumentsByType('policy').length,
    },
    {
      id: 'certification',
      name: 'Certifications',
      icon: Book,
      description: 'Training and compliance certificates',
      count: getDocumentsByType('certification').length,
    },
    {
      id: 'payroll',
      name: 'Payroll Documents',
      icon: DollarSign,
      description: 'Pay slips and tax forms',
      count: getDocumentsByType('other').length,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              </div>
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Icon className="text-indigo-600" size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Documents</span>
              <span className="text-lg font-semibold text-indigo-600">{category.count}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};