import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Calendar,
  FileText,
  BookOpen,
  DollarSign,
  AlertCircle,
  Settings,
  Shield,
  Clock,
  Building2,
  CreditCard,
  CalendarRange,
  Lock,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { usePermissions } from '../hooks/usePermissions';

const Sidebar = () => {
  const { logout, user } = useAuthStore();
  const { hasPermission } = usePermissions();

  const navItems = [
    { icon: Building2, label: 'Dashboard', path: '/', permission: null },
    { icon: Users, label: 'Employees', path: '/employees', permission: 'manage_employees' },
    { icon: Calendar, label: 'Leave Management', path: '/leave', permission: null },
    { icon: Clock, label: 'Time & Attendance', path: '/time', permission: null },
    { icon: CalendarRange, label: 'Roster', path: '/roster', permission: 'manage_roster' },
    { icon: FileText, label: 'Documents', path: '/documents', permission: null },
    { icon: BookOpen, label: 'Training', path: '/training', permission: null },
    { icon: CreditCard, label: 'Expenses', path: '/expenses', permission: null },
    { icon: DollarSign, label: 'Payroll', path: '/payroll', permission: 'manage_payroll' },
    { icon: AlertCircle, label: 'Health & Safety', path: '/health-safety', permission: null },
    { icon: Building2, label: 'Compliance', path: '/compliance', permission: 'manage_compliance' },
    { icon: Shield, label: 'Team Access', path: '/team-access', permission: 'manage_team' },
    { icon: Lock, label: 'Security', path: '/security', permission: 'manage_security' },
    { icon: Settings, label: 'Settings', path: '/settings', permission: 'manage_settings' }
  ];

  // Filter nav items based on permissions
  const filteredNavItems = navItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <div className="bg-indigo-900 text-white w-64 min-h-screen p-4 flex flex-col">
      <div className="flex items-center mb-8 px-2">
        <h1 className="text-2xl font-bold">KiwiHR</h1>
      </div>

      <nav className="flex-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-800'
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-4 px-4 py-2 border-t border-indigo-800">
        <div className="text-sm text-indigo-200 mb-4">
          <p>Logged in as:</p>
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs">{user?.role.toUpperCase()}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;