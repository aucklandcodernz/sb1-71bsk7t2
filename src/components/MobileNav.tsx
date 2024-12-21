import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  FileText,
  BookOpen,
  DollarSign,
  AlertTriangle,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: Calendar, label: 'Leave', path: '/leave' },
    { icon: Clock, label: 'Time', path: '/time' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: BookOpen, label: 'Training', path: '/training' },
    { icon: DollarSign, label: 'Payroll', path: '/payroll' },
    { icon: AlertTriangle, label: 'H&S', path: '/health-safety' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-lg"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">KiwiHR</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <nav className="p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 mt-4"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};