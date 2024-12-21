import React, { useState } from 'react';
import { Save, Bell, Lock, Globe, Building, Users } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: 'KiwiHR',
    timezone: 'Pacific/Auckland',
    language: 'en',
    emailNotifications: true,
    leaveApprovals: true,
    timeTracking: true,
    defaultWorkHours: '40',
    kiwiSaverDefaultRate: '3',
    taxYear: '2024-2025',
    payrollCycle: 'fortnightly'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to backend
    console.log('Settings saved:', settings);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your organization preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center">
                <Building className="mr-2" size={20} />
                Organization Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      className="input-field"
                    >
                      <option value="Pacific/Auckland">New Zealand (Auckland)</option>
                      <option value="Pacific/Chatham">Chatham Islands</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="input-field"
                    >
                      <option value="en">English</option>
                      <option value="mi">Te Reo Māori</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Default Weekly Work Hours
                  </label>
                  <input
                    type="number"
                    value={settings.defaultWorkHours}
                    onChange={(e) => setSettings({ ...settings, defaultWorkHours: e.target.value })}
                    className="input-field"
                    min="1"
                    max="168"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center">
                <Globe className="mr-2" size={20} />
                Payroll Settings
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tax Year
                    </label>
                    <select
                      value={settings.taxYear}
                      onChange={(e) => setSettings({ ...settings, taxYear: e.target.value })}
                      className="input-field"
                    >
                      <option value="2024-2025">2024-2025</option>
                      <option value="2023-2024">2023-2024</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Default KiwiSaver Rate
                    </label>
                    <select
                      value={settings.kiwiSaverDefaultRate}
                      onChange={(e) => setSettings({ ...settings, kiwiSaverDefaultRate: e.target.value })}
                      className="input-field"
                    >
                      <option value="3">3%</option>
                      <option value="4">4%</option>
                      <option value="6">6%</option>
                      <option value="8">8%</option>
                      <option value="10">10%</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payroll Cycle
                  </label>
                  <select
                    value={settings.payrollCycle}
                    onChange={(e) => setSettings({ ...settings, payrollCycle: e.target.value })}
                    className="input-field"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="fortnightly">Fortnightly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center">
                <Bell className="mr-2" size={20} />
                Notifications
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Leave Approvals</h3>
                    <p className="text-sm text-gray-500">
                      Notify managers for leave requests
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.leaveApprovals}
                      onChange={(e) => setSettings({ ...settings, leaveApprovals: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Time Tracking</h3>
                    <p className="text-sm text-gray-500">
                      Send daily time tracking reminders
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.timeTracking}
                      onChange={(e) => setSettings({ ...settings, timeTracking: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary flex items-center">
              <Save size={20} className="mr-2" />
              Save Settings
            </button>
          </form>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Lock className="mr-2" size={20} />
              Security
            </h2>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Two-Factor Authentication
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                API Keys
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="mr-2" size={20} />
              Team Access
            </h2>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Manage Roles
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Permissions
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Access Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;