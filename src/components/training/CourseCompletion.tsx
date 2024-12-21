import React from 'react';
import { Award, Download } from 'lucide-react';

interface CourseCompletionProps {
  courseName: string;
  completionDate: string;
  onDownloadCertificate: () => void;
}

export const CourseCompletion = ({
  courseName,
  completionDate,
  onDownloadCertificate,
}: CourseCompletionProps) => {
  return (
    <div className="text-center p-8 bg-gradient-to-b from-indigo-50 to-white rounded-lg border">
      <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
        <Award className="w-12 h-12 text-indigo-600" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Congratulations!
      </h3>
      
      <p className="text-gray-600 mb-6">
        You have successfully completed the course:
        <br />
        <span className="font-medium text-gray-900">{courseName}</span>
      </p>
      
      <p className="text-sm text-gray-500 mb-6">
        Completed on {new Date(completionDate).toLocaleDateString()}
      </p>
      
      <button
        onClick={onDownloadCertificate}
        className="btn-primary flex items-center justify-center mx-auto"
      >
        <Download className="w-5 h-5 mr-2" />
        Download Certificate
      </button>
    </div>
  );
};