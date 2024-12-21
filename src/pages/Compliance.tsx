import React, { useState } from 'react';
import { Calendar, FileText, Download, Plus, AlertCircle } from 'lucide-react';
import { useComplianceStore } from '../store/complianceStore';
import { useNZComplianceStore } from '../store/nzComplianceStore';
import { ComplianceCalendar } from '../components/compliance/ComplianceCalendar';
import { ComplianceForm } from '../components/compliance/ComplianceForm';
import { ComplianceChecklist } from '../components/compliance/ComplianceChecklist';
import { ComplianceReminders } from '../components/compliance/ComplianceReminders';
import { ComplianceStats } from '../components/compliance/ComplianceStats';
import { NZ_PUBLIC_HOLIDAYS_2024 } from '../utils/nzCompliance';

const Compliance = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'requirements' | 'agreements' | 'holidays'>('requirements');
  
  const { items, updateStatus, getStats, generateCalendar } = useComplianceStore();
  const stats = getStats();

  const handleExportCalendar = () => {
    const calendar = generateCalendar();
    const blob = new Blob([calendar], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compliance-calendar.ics';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance</h1>
          <p className="text-gray-500">Track and manage NZ compliance requirements</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleExportCalendar}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export Calendar</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Requirement</span>
          </button>
        </div>
      </div>

      <ComplianceStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="border-b">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('requirements')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'requirements'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Requirements
                </button>
                <button
                  onClick={() => setActiveTab('agreements')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'agreements'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Employment Agreements
                </button>
                <button
                  onClick={() => setActiveTab('holidays')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'holidays'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Public Holidays
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'requirements' && (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg"
                    >
                      <div className={`p-2 rounded-lg ${
                        item.type === 'critical' ? 'bg-red-100' :
                        item.type === 'important' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        <AlertCircle className={
                          item.type === 'critical' ? 'text-red-600' :
                          item.type === 'important' ? 'text-yellow-600' :
                          'text-green-600'
                        } size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                            <p className="text-sm text-gray-500 mt-1">Assigned to: {item.assignee}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'completed' ? 'bg-green-100 text-green-800' :
                            item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Due: {new Date(item.deadline).toLocaleDateString()}
                          </span>
                          <div className="space-x-2">
                            {item.status !== 'completed' && (
                              <>
                                <button
                                  onClick={() => updateStatus(item.id, 'completed')}
                                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                                >
                                  Mark Complete
                                </button>
                                {item.status === 'pending' && (
                                  <button
                                    onClick={() => updateStatus(item.id, 'in_progress')}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                  >
                                    Start Progress
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'agreements' && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-800 mb-2">Employment Agreement Requirements</h3>
                    <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                      <li>Must be in writing and signed by both parties</li>
                      <li>Include mandatory terms as per Employment Relations Act</li>
                      <li>90-day trial period only valid for small employers (&lt;20 employees)</li>
                      <li>Provide reasonable time for employee to seek advice</li>
                      <li>Keep signed copy on file</li>
                    </ul>
                  </div>

                  <div className="bg-white border rounded-lg divide-y">
                    <div className="p-4">
                      <h3 className="font-medium mb-2">Agreement Templates</h3>
                      <div className="space-y-2">
                        {[
                          { name: 'Full-time Employment Agreement', type: 'standard' },
                          { name: 'Part-time Employment Agreement', type: 'standard' },
                          { name: 'Fixed-term Employment Agreement', type: 'fixed' },
                          { name: 'Casual Employment Agreement', type: 'casual' },
                        ].map((template, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center">
                              <FileText size={20} className="text-gray-400 mr-3" />
                              <div>
                                <p className="font-medium text-sm">{template.name}</p>
                                <p className="text-xs text-gray-500">Template</p>
                              </div>
                            </div>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'holidays' && (
                <div className="space-y-4">
                  <div className="bg-white border rounded-lg">
                    <div className="p-4">
                      <h3 className="font-medium mb-4">2024 Public Holidays</h3>
                      <div className="space-y-2">
                        {NZ_PUBLIC_HOLIDAYS_2024.map((holiday, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center">
                              <Calendar size={20} className="text-gray-400 mr-3" />
                              <div>
                                <p className="font-medium text-sm">{holiday.name}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(holiday.date).toLocaleDateString('en-NZ', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                  })}
                                </p>
                              </div>
                            </div>
                            {new Date(holiday.date) > new Date() && (
                              <span className="text-sm text-gray-500">
                                {Math.ceil((new Date(holiday.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days away
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <ComplianceCalendar />
          <ComplianceReminders />
        </div>
      </div>

      {showForm && <ComplianceForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Compliance;