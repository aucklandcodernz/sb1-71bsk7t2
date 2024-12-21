import React, { useState } from 'react';
import { RoleManagement } from '../components/team/RoleManagement';
import { AccessLogs } from '../components/team/AccessLogs';
import { Shield, Clock } from 'lucide-react';

const TeamAccess = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'logs'>('roles');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Access</h1>
          <p className="text-gray-500">Manage roles and access control</p>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
              activeTab === 'roles'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield size={16} className="mr-2" />
            Roles & Permissions
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
              activeTab === 'logs'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock size={16} className="mr-2" />
            Access Logs
          </button>
        </nav>
      </div>

      {activeTab === 'roles' ? <RoleManagement /> : <AccessLogs />}
    </div>
  );
};

export default TeamAccess;