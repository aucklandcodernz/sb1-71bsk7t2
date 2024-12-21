import React, { useState } from 'react';
import { useTeamStore } from '../../store/teamStore';
import { format } from 'date-fns';
import { AlertTriangle, Download, Search, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export const SecurityAuditLog = () => {
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    startDate: '',
    endDate: ''
  });

  const logs = useTeamStore((state) => state.getAccessLogs(filters));

  const handleExport = () => {
    const data = [
      ['Security Audit Log'],
      ['Generated:', format(new Date(), 'dd/MM/yyyy HH:mm:ss')],
      [''],
      ['Timestamp', 'User', 'Action', 'Resource', 'Status', 'IP Address', 'Details'],
      ...logs.map(log => [
        format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss'),
        log.userName,
        log.action,
        log.resource,
        log.status,
        log.ipAddress,
        log.details || ''
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Security Audit');
    XLSX.writeFile(wb, `security-audit-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Security audit log exported successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Security Audit Log</h2>
            <p className="text-sm text-gray-500">Track security-related events</p>
          </div>
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by user..."
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              className="input-field pl-10"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <div>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="input-field"
            >
              <option value="">All Actions</option>
              <option value="login">Login Attempts</option>
              <option value="password_change">Password Changes</option>
              <option value="2fa">2FA Events</option>
              <option value="api_key">API Key Management</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {log.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {logs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No security events found
            </div>
          )}
        </div>

        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="text-yellow-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-yellow-700">
              <p className="font-medium mb-1">Security Best Practices:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Monitor login attempts for suspicious activity</li>
                <li>Review password changes and 2FA events</li>
                <li>Track API key usage and access patterns</li>
                <li>Investigate failed authentication attempts</li>
                <li>Keep audit logs for compliance purposes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};