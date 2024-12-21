import React from 'react';
import { useTeamStore } from '../../store/teamStore';
import { Role, Permission } from '../../types/team';
import { Check, Minus } from 'lucide-react';

interface RolePermissionMatrixProps {
  onPermissionToggle: (roleId: string, permissionId: string) => void;
}

export const RolePermissionMatrix = ({ onPermissionToggle }: RolePermissionMatrixProps) => {
  const { roles, permissions } = useTeamStore();

  const hasPermission = (role: Role, permissionId: string) => {
    return role.permissions.some(p => p.id === permissionId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Permission
            </th>
            {roles.map(role => (
              <th key={role.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {role.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {permissions.map(permission => (
            <tr key={permission.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {permission.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {permission.description}
                  </div>
                </div>
              </td>
              {roles.map(role => (
                <td key={role.id} className="px-6 py-4 text-center">
                  <button
                    onClick={() => onPermissionToggle(role.id, permission.id)}
                    className={`p-2 rounded-lg ${
                      hasPermission(role, permission.id)
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {hasPermission(role, permission.id) ? (
                      <Check size={20} />
                    ) : (
                      <Minus size={20} />
                    )}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};