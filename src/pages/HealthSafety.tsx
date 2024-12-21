import React, { useState } from 'react';
import { IncidentForm } from '../components/health-safety/IncidentForm';
import { HazardForm } from '../components/health-safety/HazardForm';
import { HazardList } from '../components/health-safety/HazardList';
import { SafetyReporting } from '../components/health-safety/SafetyReporting';
import { SafetyPolicies } from '../components/health-safety/SafetyPolicies';
import { SafetyTraining } from '../components/health-safety/SafetyTraining';
import { SafetyChecklist } from '../components/health-safety/SafetyChecklist';
import { WorkSafeCompliance } from '../components/health-safety/WorkSafeCompliance';
import { AlertTriangle, Shield, Plus } from 'lucide-react';

const HealthSafety = () => {
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showHazardForm, setShowHazardForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'incidents' | 'hazards' | 'policies' | 'training' | 'checklist' | 'reporting' | 'worksafe'>('incidents');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health & Safety</h1>
          <p className="text-gray-500">Manage workplace safety and compliance</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowHazardForm(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <AlertTriangle size={20} />
            <span>Report Hazard</span>
          </button>
          <button
            onClick={() => setShowIncidentForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'incidents'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Incidents
          </button>
          <button
            onClick={() => setActiveTab('hazards')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'hazards'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Hazards
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'policies'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Policies
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'training'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Training
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'checklist'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Checklist
          </button>
          <button
            onClick={() => setActiveTab('reporting')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'reporting'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Reporting
          </button>
          <button
            onClick={() => setActiveTab('worksafe')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'worksafe'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            WorkSafe
          </button>
        </nav>
      </div>

      {activeTab === 'incidents' && <HazardList />}
      {activeTab === 'hazards' && <HazardList />}
      {activeTab === 'policies' && <SafetyPolicies />}
      {activeTab === 'training' && <SafetyTraining />}
      {activeTab === 'checklist' && <SafetyChecklist />}
      {activeTab === 'reporting' && <SafetyReporting />}
      {activeTab === 'worksafe' && <WorkSafeCompliance />}

      {showIncidentForm && <IncidentForm onClose={() => setShowIncidentForm(false)} />}
      {showHazardForm && <HazardForm onClose={() => setShowHazardForm(false)} />}
    </div>
  );
};

export default HealthSafety;