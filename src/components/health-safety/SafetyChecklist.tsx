import React, { useState } from 'react';
import { useHealthSafetyStore } from '../../store/healthSafetyStore';
import { generateSafetyChecklist } from '../../utils/healthSafetyUtils';
import { CheckSquare, Square, AlertCircle, Download } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export const SafetyChecklist = () => {
  const { hazards } = useHealthSafetyStore();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const checklist = generateSafetyChecklist(hazards);

  const handleCheck = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNoteChange = (categoryIndex: number, itemIndex: number, note: string) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setNotes(prev => ({
      ...prev,
      [key]: note
    }));
  };

  const calculateProgress = () => {
    const totalItems = checklist.reduce((sum, category) => sum + category.items.length, 0);
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((checkedCount / totalItems) * 100);
  };

  const handleExport = () => {
    const data = [
      ['Safety Inspection Checklist'],
      ['Date:', format(new Date(), 'dd/MM/yyyy')],
      ['Inspector:', 'Your Name'],
      [''],
      ...checklist.flatMap(category => [
        [category.category.toUpperCase()],
        ...category.items.map((item, itemIndex) => {
          const key = `${category.category}-${itemIndex}`;
          return [
            item,
            checkedItems[key] ? '✓' : '✗',
            notes[key] || ''
          ];
        }),
        ['']
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Safety Checklist');
    XLSX.writeFile(wb, `safety-checklist-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Checklist exported successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Safety Inspection Checklist</h2>
          <p className="text-sm text-gray-500">WorkSafe NZ Compliant</p>
        </div>
        <button
          onClick={handleExport}
          className="btn-secondary flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Export</span>
        </button>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 rounded-full h-2 transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        <div className="space-y-8">
          {checklist.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-lg font-medium mb-4">{category.category}</h3>
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const key = `${categoryIndex}-${itemIndex}`;
                  return (
                    <div key={itemIndex} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                      <button
                        onClick={() => handleCheck(categoryIndex, itemIndex)}
                        className="mt-1"
                      >
                        {checkedItems[key] ? (
                          <CheckSquare className="text-green-600" size={20} />
                        ) : (
                          <Square className="text-gray-400" size={20} />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className="text-gray-700">{item}</p>
                        <input
                          type="text"
                          placeholder="Add notes..."
                          value={notes[key] || ''}
                          onChange={(e) => handleNoteChange(categoryIndex, itemIndex, e.target.value)}
                          className="mt-2 w-full text-sm text-gray-500 bg-transparent border-b border-gray-200 focus:border-indigo-500 focus:ring-0"
                        />
                      </div>
                    </div>
                  );
                })}
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
                <li>Regular safety inspections required</li>
                <li>Document all findings and actions</li>
                <li>Follow up on identified hazards</li>
                <li>Keep records for 7 years</li>
                <li>Review and update checklist regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};