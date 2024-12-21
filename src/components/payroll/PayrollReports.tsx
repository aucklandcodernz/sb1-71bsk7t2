import React, { useState } from 'react';
import { usePayrollStore } from '../../store/payrollStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { Download, FileText, AlertCircle, Calendar, DollarSign, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import {
  generateKiwiSaverReport,
  generateLeaveLiabilityReport,
  generatePayrollAuditReport,
  generateCostAnalysisReport,
  generateTaxReconciliationReport,
} from '../../utils/payrollReportUtils';
import toast from 'react-hot-toast';

export const PayrollReports = () => {
  const [period, setPeriod] = useState(format(new Date(), 'yyyy-MM'));
  const entries = usePayrollStore((state) => state.entries);
  const employees = useEmployeeStore((state) => state.employees);

  const handleExport = (reportType: string) => {
    try {
      let workbook;
      let filename;

      switch (reportType) {
        case 'kiwisaver':
          workbook = generateKiwiSaverReport(employees, entries, period);
          filename = `kiwisaver-report-${period}.xlsx`;
          break;
        case 'leave':
          workbook = generateLeaveLiabilityReport(employees, period);
          filename = `leave-liability-${period}.xlsx`;
          break;
        case 'audit':
          workbook = generatePayrollAuditReport(entries, period);
          filename = `payroll-audit-${period}.xlsx`;
          break;
        case 'cost':
          workbook = generateCostAnalysisReport(employees, entries, period);
          filename = `cost-analysis-${period}.xlsx`;
          break;
        case 'tax':
          workbook = generateTaxReconciliationReport(entries, period);
          filename = `tax-reconciliation-${period}.xlsx`;
          break;
        default:
          throw new Error('Invalid report type');
      }

      XLSX.writeFile(workbook, filename);
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to generate report');
      console.error('Report generation error:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Payroll Reports</h2>
        <div className="flex space-x-4">
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => handleExport('kiwisaver')}
          className="p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-lg mr-4">
              <FileText className="text-indigo-600" size={20} />
            </div>
            <div>
              <h3 className="font-medium">KiwiSaver Report</h3>
              <p className="text-sm text-gray-500">Employee contributions</p>
            </div>
          </div>
          <Download className="text-gray-400" size={20} />
        </button>

        <button
          onClick={() => handleExport('leave')}
          className="p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Calendar className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="font-medium">Leave Liability</h3>
              <p className="text-sm text-gray-500">Leave balances and costs</p>
            </div>
          </div>
          <Download className="text-gray-400" size={20} />
        </button>

        <button
          onClick={() => handleExport('audit')}
          className="p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <div>
              <h3 className="font-medium">Payroll Audit</h3>
              <p className="text-sm text-gray-500">Payment verification</p>
            </div>
          </div>
          <Download className="text-gray-400" size={20} />
        </button>

        <button
          onClick={() => handleExport('cost')}
          className="p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-medium">Cost Analysis</h3>
              <p className="text-sm text-gray-500">Department-wise costs</p>
            </div>
          </div>
          <Download className="text-gray-400" size={20} />
        </button>

        <button
          onClick={() => handleExport('tax')}
          className="p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <DollarSign className="text-purple-600" size={20} />
            </div>
            <div>
              <h3 className="font-medium">Tax Reconciliation</h3>
              <p className="text-sm text-gray-500">Tax deductions summary</p>
            </div>
          </div>
          <Download className="text-gray-400" size={20} />
        </button>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Report Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Keep payroll records for 7 years</li>
              <li>Include all required tax information</li>
              <li>Maintain employee privacy</li>
              <li>Regular backups recommended</li>
              <li>Available for IRD audit if required</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};