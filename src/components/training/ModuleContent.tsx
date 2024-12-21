import React from 'react';
import { Play, FileText, Clock } from 'lucide-react';

interface ModuleContentProps {
  module: {
    title: string;
    content: string;
    duration: string;
    resources?: {
      name: string;
      type: string;
      url: string;
    }[];
  };
  onComplete: () => void;
  isCompleted: boolean;
}

export const ModuleContent = ({ module, onComplete, isCompleted }: ModuleContentProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{module.title}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {module.duration}
        </div>
      </div>

      <div className="prose max-w-none">
        <p>{module.content}</p>
      </div>

      {module.resources && (
        <div>
          <h4 className="font-medium mb-3">Resources</h4>
          <div className="space-y-2">
            {module.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{resource.name}</p>
                  <p className="text-xs text-gray-500">{resource.type}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {!isCompleted && (
        <button
          onClick={onComplete}
          className="w-full btn-primary flex items-center justify-center"
        >
          <Play className="w-5 h-5 mr-2" />
          Complete Module
        </button>
      )}
    </div>
  );
};