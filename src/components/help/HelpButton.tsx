import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { HelpContent } from './HelpContent';
import { QuickStart } from './QuickStart';

export const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        title="Help & Documentation"
      >
        <HelpCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            {showQuickStart ? (
              <QuickStart onClose={() => setShowQuickStart(false)} />
            ) : (
              <HelpContent onShowQuickStart={() => setShowQuickStart(true)} />
            )}
          </div>
        </div>
      )}
    </>
  );
};