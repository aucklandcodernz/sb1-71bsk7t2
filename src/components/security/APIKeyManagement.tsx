import React, { useState } from 'react';
import { Key, Copy, Trash2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  scopes: string[];
}

export const APIKeyManagement = () => {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    scopes: [] as string[],
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newKey: APIKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      key: `khr_${Math.random().toString(36).substr(2, 24)}`,
      createdAt: new Date().toISOString(),
      scopes: formData.scopes,
    };

    setKeys([...keys, newKey]);
    setShowCreateForm(false);
    setFormData({ name: '', scopes: [] });
    toast.success('API key created successfully');
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      setKeys(keys.filter((k) => k.id !== id));
      toast.success('API key deleted successfully');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">API Keys</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          Create API Key
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Key Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="e.g., Production API Key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions
              </label>
              <div className="space-y-2">
                {[
                  'read:employees',
                  'write:employees',
                  'read:payroll',
                  'write:payroll',
                  'read:documents',
                  'write:documents',
                ].map((scope) => (
                  <label key={scope} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.scopes.includes(scope)}
                      onChange={(e) => {
                        const newScopes = e.target.checked
                          ? [...formData.scopes, scope]
                          : formData.scopes.filter((s) => s !== scope);
                        setFormData({ ...formData, scopes: newScopes });
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{scope}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Key
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {keys.map((key) => (
          <div
            key={key.id}
            className="border rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <Key className="text-gray-400 mr-2" size={20} />
                  <h4 className="font-medium">{key.name}</h4>
                </div>
                <div className="mt-1 font-mono text-sm text-gray-600">
                  {key.key.slice(0, 12)}...
                  <button
                    onClick={() => handleCopy(key.key)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {key.scopes.map((scope) => (
                    <span
                      key={scope}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleDelete(key.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Created: {new Date(key.createdAt).toLocaleDateString()}
              {key.lastUsed && (
                <span className="ml-4">
                  Last used: {new Date(key.lastUsed).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}

        {keys.length === 0 && !showCreateForm && (
          <div className="text-center py-8 text-gray-500">
            No API keys yet. Click "Create API Key" to get started.
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">API Key Security:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Keep your API keys secure and confidential</li>
              <li>Use different keys for different environments</li>
              <li>Rotate keys regularly for security</li>
              <li>Delete unused keys immediately</li>
              <li>Monitor API key usage for suspicious activity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};