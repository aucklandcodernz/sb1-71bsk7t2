import React, { useState } from 'react';
import { useEmployeeStore } from '../../store/employeeStore';
import { X, Mail, Phone, MapPin, Calendar, DollarSign, AlertCircle, FileText, User, Briefcase, GraduationCap, CheckSquare, TrendingUp, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { LeaveManagementTab } from './LeaveManagementTab';
import { TimeTrackingTab } from './TimeTrackingTab';
import { PayrollTab } from './PayrollTab';
import { PerformanceTab } from './PerformanceTab';
import { PersonalDetailsForm } from './PersonalDetailsForm';
import { EmploymentDetailsForm } from './EmploymentDetailsForm';
import { DocumentsForm } from './DocumentsForm';
import { QualificationsForm } from './QualificationsForm';
import { InductionForm } from './InductionForm';

interface EmployeeProfileProps {
  employeeId: string;
  onClose: () => void;
}

export const EmployeeProfile = ({ employeeId, onClose }: EmployeeProfileProps) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'personal' | 'employment' | 'documents' | 'qualifications' | 
    'induction' | 'leave' | 'time' | 'payroll' | 'performance'
  >('overview');
  
  const employee = useEmployeeStore((state) => state.getEmployeeById(employeeId));

  if (!employee) return null;

  const isNewEmployee = !employee.bankAccount || !employee.taxCode || !employee.irdNumber;
  const hasIncompleteInduction = !employee.induction?.completed;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{employee.name}</h2>
            <p className="text-gray-500">{employee.position}</p>
            <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
              employee.status === 'active'
                ? 'bg-green-100 text-green-800'
                : employee.status === 'on_leave'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {employee.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {(isNewEmployee || hasIncompleteInduction) && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="text-yellow-600 mt-0.5 mr-2" size={16} />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">
                      Action Required
                    </h3>
                    <div className="mt-1 text-sm text-yellow-700 space-y-1">
                      {isNewEmployee && (
                        <p>Please complete employee onboarding details.</p>
                      )}
                      {hasIncompleteInduction && (
                        <p>Employee induction needs to be completed.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <nav className="flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                    activeTab === 'overview'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <User size={16} className="mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                    activeTab === 'personal'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <User size={16} className="mr-2" />
                  Personal Details
                </button>
                <button
                  onClick={() => setActiveTab('employment')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                    activeTab === 'employment'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Briefcase size={16} className="mr-2" />
                  Employment
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                    activeTab === 'documents'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileText size={16} className="mr-2" />
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab('qualifications')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                    activeTab === 'qualifications'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <GraduationCap size={16} className="mr-2" />
                  Qualifications
                </button>
                <button
                  onClick={() => setActiveTab('induction')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                    activeTab === 'induction'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <CheckSquare size={16} className="mr-2" />
                  Induction
                </button>
                <button
                  onClick={() => setActiveTab('leave')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                    activeTab === 'leave'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Calendar size={16} className="mr-2" />
                  Leave
                </button>
                <button
                  onClick={() => setActiveTab('time')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                    activeTab === 'time'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Clock size={16} className="mr-2" />
                  Time
                </button>
                <button
                  onClick={() => setActiveTab('payroll')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                    activeTab === 'payroll'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <DollarSign size={16} className="mr-2" />
                  Payroll
                </button>
                <button
                  onClick={() => setActiveTab('performance')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                    activeTab === 'performance'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <TrendingUp size={16} className="mr-2" />
                  Performance
                </button>
              </nav>
            </div>

            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Mail size={16} className="mr-2" />
                        {employee.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone size={16} className="mr-2" />
                        {employee.phoneNumber}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        {employee.address}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Employment Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        Started: {format(new Date(employee.startDate), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign size={16} className="mr-2" />
                        Salary: ${parseFloat(employee.salary || '0').toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
                    <p className="text-gray-600">{employee.emergencyContact}</p>
                  </div>
                </div>

                <div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Payroll Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax Code:</span>
                        <span className="font-medium">{employee.taxCode}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">KiwiSaver Rate:</span>
                        <span className="font-medium">{employee.kiwiSaverRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bank Account:</span>
                        <span className="font-medium">{employee.bankAccount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">IRD Number:</span>
                        <span className="font-medium">{employee.irdNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'personal' && (
              <PersonalDetailsForm employeeId={employeeId} onClose={() => setActiveTab('overview')} />
            )}

            {activeTab === 'employment' && (
              <EmploymentDetailsForm employeeId={employeeId} onClose={() => setActiveTab('overview')} />
            )}

            {activeTab === 'documents' && (
              <DocumentsForm employeeId={employeeId} onClose={() => setActiveTab('overview')} />
            )}

            {activeTab === 'qualifications' && (
              <QualificationsForm employeeId={employeeId} onClose={() => setActiveTab('overview')} />
            )}

            {activeTab === 'induction' && (
              <InductionForm employeeId={employeeId} onClose={() => setActiveTab('overview')} />
            )}

            {activeTab === 'leave' && <LeaveManagementTab employeeId={employeeId} />}
            {activeTab === 'time' && <TimeTrackingTab employeeId={employeeId} />}
            {activeTab === 'payroll' && <PayrollTab employeeId={employeeId} />}
            {activeTab === 'performance' && <PerformanceTab employeeId={employeeId} />}
          </div>
        </div>
      </div>
    </div>
  );
};