import React from 'react';
import { ArrowRight, Book, Video, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface QuickStartProps {
  onClose: () => void;
}

export const QuickStart = ({ onClose }: QuickStartProps) => {
  const steps = [
    {
      title: 'Organization Setup',
      description: 'Configure your company details and settings',
      type: 'video',
      duration: '5:30',
    },
    {
      title: 'Employee Management',
      description: 'Learn how to add and manage employees',
      type: 'guide',
      readTime: '10 min',
    },
    {
      title: 'NZ Compliance',
      description: 'Essential compliance requirements',
      type: 'checklist',
      items: 12,
    },
  ];

  const handleStepClick = (step: any) => {
    toast.success(`Opening ${step.title} guide`);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Quick Start Guide</h2>
        <p className="text-gray-500 mt-1">Get started with KiwiHR</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(step)}
                className="w-full text-left"
              >
                <div className="p-6 border rounded-lg hover:border-indigo-500 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium flex items-center">
                        {step.type === 'video' && (
                          <Video className="mr-2 text-indigo-600" size={20} />
                        )}
                        {step.type === 'guide' && (
                          <Book className="mr-2 text-indigo-600" size={20} />
                        )}
                        {step.type === 'checklist' && (
                          <AlertCircle className="mr-2 text-indigo-600" size={20} />
                        )}
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{step.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        {step.type === 'video' && `Duration: ${step.duration}`}
                        {step.type === 'guide' && `Read time: ${step.readTime}`}
                        {step.type === 'checklist' && `${step.items} items`}
                      </div>
                    </div>
                    <ArrowRight className="text-gray-400" size={20} />
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h4 className="font-medium text-blue-900 mb-2">Need More Help?</h4>
            <p className="text-blue-800 text-sm">
              Our support team is available to help you get started:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-blue-800">
              <li>• Email: support@kiwihr.co.nz</li>
              <li>• Phone: 0800 KIWIHR</li>
              <li>• Live Chat: Available 9am-5pm NZST</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 border-t bg-gray-50">
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to Help Center
          </button>
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};