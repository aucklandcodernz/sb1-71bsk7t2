import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export const HelpTooltip = ({ content, position = 'top' }: HelpTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  };

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="text-gray-400 hover:text-gray-600"
      >
        <HelpCircle size={16} />
      </button>

      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]}`}
          style={{ width: '12rem' }}
        >
          <div className="bg-gray-900 text-white text-sm rounded-lg p-2 shadow-lg">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};