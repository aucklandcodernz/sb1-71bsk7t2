import React from 'react';
import { FileText, Download } from 'lucide-react';

export const DocumentTemplates = () => {
  const templates = [
    {
      id: 'emp-agreement',
      name: 'Employment Agreement',
      description: 'Standard NZ employment contract template',
      lastUpdated: '2024-03-01',
      category: 'Contracts',
    },
    {
      id: 'health-safety',
      name: 'Health & Safety Policy',
      description: 'Workplace safety guidelines and procedures',
      lastUpdated: '2024-02-15',
      category: 'Policies',
    },
    {
      id: 'privacy-policy',
      name: 'Privacy Policy',
      description: 'Employee data protection and privacy guidelines',
      lastUpdated: '2024-02-01',
      category: 'Policies',
    },
    {
      id: 'leave-request',
      name: 'Leave Request Form',
      description: 'Standard leave application template',
      lastUpdated: '2024-01-15',
      category: 'Forms',
    },
  ];

  const handleDownload = (templateId: string) => {
    // In a real app, this would download the template
    console.log('Downloading template:', templateId);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Document Templates</h2>
        <p className="text-sm text-gray-500 mt-1">
          NZ-compliant document templates
        </p>
      </div>
      <div className="p-6">
        <div className="grid gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <FileText className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.description}</p>
                  <div className="flex items-center mt-1 space-x-4">
                    <span className="text-xs text-gray-400">
                      Last updated: {new Date(template.lastUpdated).toLocaleDateString()}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDownload(template.id)}
                className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600"
                title="Download template"
              >
                <Download size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};