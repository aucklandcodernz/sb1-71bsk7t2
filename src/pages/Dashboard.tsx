import React from 'react';
import { Users, Calendar, AlertCircle, TrendingUp, Clock, DollarSign, FileText, Shield } from 'lucide-react';
import { useEmployeeStore } from '../store/employeeStore';
import { useLeaveStore } from '../store/leaveStore';
import { useTimeTrackingStore } from '../store/timeTrackingStore';
import { usePayrollStore } from '../store/payrollStore';
import { useHealthSafetyStore } from '../store/healthSafetyStore';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatCard = ({ icon: Icon, label, value, trend, color = 'indigo' }: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
  color?: string;
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {trend && (
          <div className="flex items-center mt-2 text-green-500 text-sm">
            <TrendingUp size={16} className="mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div className={`bg-${color}-100 p-3 rounded-lg`}>
        <Icon className={`text-${color}-600`} size={24} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const activeEmployees = useEmployeeStore((state) => state.getActiveEmployees());
  const employeesOnLeave = useEmployeeStore((state) => state.getEmployeesOnLeave());
  const pendingLeaveRequests = useLeaveStore((state) => state.leaveRequests.filter(r => r.status === 'pending'));
  const payrollStats = usePayrollStore((state) => state.getPayrollStats());
  const healthSafetyStats = useHealthSafetyStore((state) => state.getStats());
  
  const timeEntries = useTimeTrackingStore((state) => state.entries);
  const activeTimeEntries = timeEntries.filter(e => !e.clockOut);

  // Attendance chart data
  const attendanceData = {
    labels: ['Present', 'On Leave', 'Late', 'Absent'],
    datasets: [{
      data: [
        activeEmployees.length - employeesOnLeave.length,
        employeesOnLeave.length,
        2,
        1
      ],
      backgroundColor: [
        'rgba(16, 185, 129, 0.2)',
        'rgba(245, 158, 11, 0.2)',
        'rgba(239, 68, 68, 0.2)',
        'rgba(107, 114, 128, 0.2)'
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(107, 114, 128, 1)'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome to KiwiHR</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Active Employees"
          value={activeEmployees.length.toString()}
          trend="+2 this month"
          color="blue"
        />
        <StatCard
          icon={Calendar}
          label="On Leave Today"
          value={employeesOnLeave.length.toString()}
          color="yellow"
        />
        <StatCard
          icon={Clock}
          label="Clocked In Now"
          value={activeTimeEntries.length.toString()}
          color="green"
        />
        <StatCard
          icon={DollarSign}
          label="Monthly Payroll"
          value={`$${Math.round(payrollStats.totalPayroll).toLocaleString()}`}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {pendingLeaveRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{request.employeeId}</p>
                    <p className="text-sm text-gray-500">Leave Request</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(request.startDate), 'MMM d')} - {format(new Date(request.endDate), 'MMM d')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Health & Safety Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600">Open Incidents</p>
                    <p className="text-2xl font-bold text-red-700">{healthSafetyStats.openIncidents}</p>
                  </div>
                  <AlertCircle className="text-red-500" size={24} />
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Days Without Incident</p>
                    <p className="text-2xl font-bold text-green-700">{healthSafetyStats.daysWithoutIncident}</p>
                  </div>
                  <Shield className="text-green-500" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Attendance Overview</h2>
            <div className="aspect-square">
              <Doughnut 
                data={attendanceData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center">
                <FileText className="text-gray-400 mr-2" size={20} />
                <span>Generate Payroll</span>
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center">
                <Users className="text-gray-400 mr-2" size={20} />
                <span>Add Employee</span>
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center">
                <Calendar className="text-gray-400 mr-2" size={20} />
                <span>Approve Leave</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;