import React, { useState } from 'react';
import { Lock, Key, Shield, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { PasswordChange } from './PasswordChange';
import { TwoFactorSetup } from './TwoFactorSetup';
import { APIKeyManagement } from './APIKeyManagement';
import toast from 'react-hot-toast';

export const SecuritySettings = () => {
  const [activeSection, setActiveSection] = useState<'password' | '2fa' | 'api'>('password');
  const user = useAuthStore((state) => state.user);

  const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
    try {
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error('Failed to update password');
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update 2FA settings');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Security Settings</h2>
        <p className="text-sm text-gray-500">Manage your account security</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection('password')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeSection === 'password'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Lock size={20} />
                <span>Change Password</span>
              </button>
              <button
                onClick={() => setActiveSection('2fa')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeSection === '2fa'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Shield size={20} />
                <span>Two-Factor Authentication</span>
              </button>
              <button
                onClick={() => setActiveSection('api')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeSection === 'api'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Key size={20} />
                <span>API Keys</span>
              </button>
            </nav>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="text-yellow-600 mt-0.5 mr-2" size={16} />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">Security Best Practices:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use strong, unique passwords</li>
                    <li>Enable two-factor authentication</li>
                    <li>Regularly review API key access</li>
                    <li>Monitor account activity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {activeSection === 'password' && (
              <PasswordChange onSubmit={handlePasswordChange} />
            )}
            {activeSection === '2fa' && (
              <TwoFactorSetup onToggle={handleTwoFactorToggle} />
            )}
            {activeSection === 'api' && <APIKeyManagement />}
          </div>
        </div>
      </div>
    </div>
  );
};