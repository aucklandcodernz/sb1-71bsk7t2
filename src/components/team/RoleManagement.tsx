import React, { useState } from 'react';
import { useTeamStore } from '../../store/teamStore';
import { Role, Permission } from '../../types/team';
import { Shield, Edit2, Trash2, Plus } from 'lucide-react';

export const RoleManagement = () => {
  const { roles, permissions, addRole, updateRole, deleteRole } = useTeamStore();
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const rolePermissions = permissions.filter(p => 
      formData.permissions.includes(p.id)
    );
    
    if (editingRole) {
      updateRole(editingRole.id, {
        ...formData,
        permissions: rolePermissions
      });
    } else {
      addRole({
        ...formData,
        permissions: rolePermissions
      });
    }
    
    setShowForm(false);
    setEditingRole(null);
    setFormData({ name: '', description: '', permissions: [] });
  };

  const handleDelete = (roleId: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      deleteRole(roleId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Role Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Role</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Shield className="text-indigo-600 mr-3" size={24} />
                  <div>
                    <h3 className="font-medium">{role.name}</h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingRole(role);
                      setFormData({
                        name: role.name,
                        description: role.description,
                        permissions: role.permissions.map(p => p.id)
                      });
                      setShowForm(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <span
                      key={permission.id}
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                    >
                      {permission.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingRole ? 'Edit Role' : 'Add Role'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {permissions.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={(e) => {
                          const newPermissions = e.target.checked
                            ? [...formData.permissions, permission.id]
                            : formData.permissions.filter(id => id !== permission.id);
                          setFormData({ ...formData, permissions: newPermissions });
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="text-sm font-medium">{permission.name}</p>
                        <p className="text-xs text-gray-500">{permission.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRole(null);
                    setFormData({ name: '', description: '', permissions: [] });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingRole ? 'Update Role' : 'Add Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};