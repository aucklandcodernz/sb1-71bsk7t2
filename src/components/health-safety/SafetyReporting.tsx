import React, { useState } from 'react';
import { useHealthSafetyStore } from '../../store/healthSafetyStore';
import { AlertTriangle, FileText, Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export const SafetyReporting = () => {
  const [reportType, setReportType] = useState('incidents');
  const [dateRange, setDateRange] = useState({
    start: format(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });

  const { incidents, hazards } = useHealthSafetyStore();

  const handleExport = () => {
    const data = [
      ['Health & Safety Report - WorkSafe NZ Compliant'],
      ['Period:', `${format(new Date(dateRange.start), 'dd/MM/yyyy')} to ${format(new Date(dateRange.end), 'dd/MM/yyyy')}`],
      ['Generated:', format(new Date(), 'dd/MM/yyyy')],
      [''],
      reportType === 'incidents' 
        ? [
            ['Date', 'Type', 'Location', 'Description', 'Severity', 'Status', 'Actions Taken'],
            ...incidents.map(incident => [
              format(new Date(incident.date), 'dd/MM/yyyy'),
              incident.type,
              incident.location,
              incident.description,
              incident.severity,
              incident.status,
              incident.actions.map(a => a.description).join('; ')
            ])
          ]
        : [
            ['Type', 'Location', 'Risk Level', 'Controls', 'Review Date', 'Status'],
            ...hazards.map(hazard => [
              hazard.type,
              hazard.location,
              hazard.risk,
              hazard.controls.join('; '),
              format(new Date(hazard.reviewDate), 'dd/MM/yyyy'),
              hazard.status
            ])
          ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportType.charAt(0).toUpperCase() + reportType.slice(1));
    XLSX.writeFile(wb, `safety-report-${reportType}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Safety report exported successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Safety Reporting</h2>
            <p className="text-sm text-gray-500">WorkSafe NZ compliant reports</p>
          </div>
          <button
            onClick={handleExport}
            className="btn-primary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input-field"
            >
              <option value="incidents">Incident Report</option>
              <option value="hazards">Hazard Register</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div className="space-y-6">
          {reportType === 'incidents' ? (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Incident Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Incidents</p>
                  <p className="text-2xl font-bold">{incidents.length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Open Incidents</p>
                  <p className="text-2xl font-bold">
                    {incidents.filter(i => i.status === 'investigating').length}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Notifiable Events</p>
                  <p className="text-2xl font-bold">
                    {incidents.filter(i => i.severity === 'notifiable').length}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Hazard Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Hazards</p>
                  <p className="text-2xl font-bold">{hazards.length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Active Hazards</p>
                  <p className="text-2xl font-bold">
                    {hazards.filter(h => h.status === 'active').length}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Critical Risk</p>
                  <p className="text-2xl font-bold">
                    {hazards.filter(h => h.risk === 'critical').length}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="text-blue-600 mt-0.5 mr-2" size={16} />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">WorkSafe NZ Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Keep records for at least 7 years</li>
                  <li>Include all notifiable events</li>
                  <li>Document all control measures</li>
                  <li>Regular review and updates</li>
                  <li>Make records available to WorkSafe inspectors</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};