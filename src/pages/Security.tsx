import React, { useState } from 'react';
import { SecurityDashboard } from '../components/security/SecurityDashboard';
import { SecuritySettings } from '../components/security/SecuritySettings';
import { SecurityAuditLog } from '../components/security/SecurityAuditLog';
import { Lock, Shield, Key } from 'lucide-react';

const Security = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'audit'>('dashboard');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security</h1>
          <p className="text-gray-500">Manage account security and access control</p>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
              activeTab === 'dashboard'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield size={16} className="mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
              activeTab === 'settings'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Lock size={16} className="mr-2" />
            Settings
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
              activeTab === 'audit'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Key size={16} className="mr-2" />
            Audit Log
          </button>
        </nav>
      </div>

      {activeTab === 'dashboard' && <SecurityDashboard />}
      {activeTab === 'settings' && <SecuritySettings />}
      {activeTab === 'audit' && <SecurityAuditLog />}
    </div>
  );
};

export default Security;