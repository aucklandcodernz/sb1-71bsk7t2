import React, { useState } from 'react';
import { Calendar, Plus, FileText } from 'lucide-react';
import { useLeaveStore } from '../store/leaveStore';
import { useEmployeeStore } from '../store/employeeStore';
import { LeaveRequestForm } from '../components/leave/LeaveRequestForm';
import { LeaveCalendar } from '../components/leave/LeaveCalendar';
import { LeaveBalances } from '../components/leave/LeaveBalances';
import { LeavePolicies } from '../components/leave/LeavePolicies';
import { format } from 'date-fns';

const LeaveManagement = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'balances' | 'policies'>('calendar');
  
  const leaveRequests = useLeaveStore((state) => state.leaveRequests);
  const updateLeaveRequest = useLeaveStore((state) => state.updateLeaveRequest);
  const employees = useEmployeeStore((state) => state.employees);

  const handleApprove = (id: string) => {
    updateLeaveRequest(id, 'approved');
  };

  const handleReject = (id: string) => {
    updateLeaveRequest(id, 'rejected');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500">Manage employee leave and time off</p>
        </div>
        <button
          onClick={() => setShowRequestForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Leave Request</span>
        </button>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'calendar'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setActiveTab('balances')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'balances'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Leave Balances
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'policies'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Leave Policies
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'calendar' && <LeaveCalendar />}
          {activeTab === 'balances' && <LeaveBalances />}
          {activeTab === 'policies' && <LeavePolicies />}
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
            <div className="space-y-4">
              {leaveRequests
                .filter(request => request.status === 'pending')
                .map(request => {
                  const employee = employees.find(e => e.id === request.employeeId);
                  return (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{employee?.name}</span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(request.startDate), 'MMM d')} - {format(new Date(request.endDate), 'MMM d')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{request.type} Leave</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              {leaveRequests.filter(r => r.status === 'pending').length === 0 && (
                <p className="text-center text-gray-500">No pending requests</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mt-6 p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">On Leave Today</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {leaveRequests.filter(r => 
                    r.status === 'approved' &&
                    new Date(r.startDate) <= new Date() &&
                    new Date(r.endDate) >= new Date()
                  ).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Requests</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {leaveRequests.filter(r => r.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved This Month</span>
                <span className="text-2xl font-bold text-green-600">
                  {leaveRequests.filter(r => 
                    r.status === 'approved' &&
                    new Date(r.startDate).getMonth() === new Date().getMonth()
                  ).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRequestForm && (
        <LeaveRequestForm onClose={() => setShowRequestForm(false)} />
      )}
    </div>
  );
};

export default LeaveManagement;