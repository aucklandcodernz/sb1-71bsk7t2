import React, { useState } from 'react';
import { PayrollDashboard } from '../components/payroll/PayrollDashboard';
import { PayrollProcessing } from '../components/payroll/PayrollProcessing';
import { PayrollBatchProcessing } from '../components/payroll/PayrollBatchProcessing';
import { PayrollSummary } from '../components/payroll/PayrollSummary';
import { PayrollHistory } from '../components/payroll/PayrollHistory';
import { KiwiSaverCompliance } from '../components/payroll/KiwiSaverCompliance';
import { PayrollReports } from '../components/payroll/PayrollReports';
import { PayslipGenerator } from '../components/payroll/PayslipGenerator';

const Payroll = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'process' | 'batch' | 'summary' | 'kiwisaver' | 'history' | 'reports' | 'payslips'>('dashboard');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
          <p className="text-gray-500">Process and manage employee payments</p>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'dashboard'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'process'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Process Individual
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'batch'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Batch Processing
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'summary'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('kiwisaver')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'kiwisaver'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            KiwiSaver
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'history'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'reports'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab('payslips')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'payslips'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Payslips
          </button>
        </nav>
      </div>

      {activeTab === 'dashboard' && <PayrollDashboard />}
      {activeTab === 'process' && <PayrollProcessing />}
      {activeTab === 'batch' && <PayrollBatchProcessing />}
      {activeTab === 'summary' && <PayrollSummary />}
      {activeTab === 'kiwisaver' && <KiwiSaverCompliance />}
      {activeTab === 'history' && <PayrollHistory />}
      {activeTab === 'reports' && <PayrollReports />}
      {activeTab === 'payslips' && <PayslipGenerator />}
    </div>
  );
};

export default Payroll;