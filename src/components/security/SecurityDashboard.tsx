import React from 'react';
import { SecuritySettings } from './SecuritySettings';
import { SecurityAuditLog } from './SecurityAuditLog';
import { RolePermissionMatrix } from '../team/RolePermissionMatrix';
import { useTeamStore } from '../../store/teamStore';
import toast from 'react-hot-toast';

export const SecurityDashboard = () => {
  const updateRole = useTeamStore((state) => state.updateRole);

  const handlePermissionToggle = (roleId: string, permissionId: string) => {
    try {
      updateRole(roleId, { permissionId });
      toast.success('Permissions updated successfully');
    } catch (error) {
      toast.error('Failed to update permissions');
    }
  };

  return (
    <div className="space-y-6">
      <SecuritySettings />
      <RolePermissionMatrix onPermissionToggle={handlePermissionToggle} />
      <SecurityAuditLog />
    </div>
  );
};