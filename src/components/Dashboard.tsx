import React from 'react';
import { Users, Calendar, AlertCircle, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend }: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
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
      <div className="bg-indigo-100 p-3 rounded-lg">
        <Icon className="text-indigo-600" size={24} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Total Employees"
          value="156"
          trend="+3.2% this month"
        />
        <StatCard
          icon={Calendar}
          label="On Leave Today"
          value="8"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Reviews"
          value="12"
        />
        <StatCard
          icon={Users}
          label="Open Positions"
          value="5"
          trend="3 new this week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Leave Requests</h2>
          <div className="space-y-4">
            {[
              { name: 'Sarah Johnson', type: 'Annual Leave', dates: '15-18 Mar' },
              { name: 'Mike Williams', type: 'Sick Leave', dates: '14 Mar' },
              { name: 'Emma Davis', type: 'Personal Leave', dates: '20-21 Mar' },
            ].map((request, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{request.name}</p>
                  <p className="text-sm text-gray-500">{request.type}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{request.dates}</span>
                  <button className="text-indigo-600 hover:text-indigo-800">Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Compliance Updates</h2>
          <div className="space-y-4">
            {[
              { title: 'Health & Safety Review Due', deadline: '5 days', priority: 'high' },
              { title: 'Employment Agreements Update', deadline: '2 weeks', priority: 'medium' },
              { title: 'Privacy Policy Review', deadline: '1 month', priority: 'low' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">Due in {item.deadline}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  item.priority === 'high' ? 'bg-red-100 text-red-800' :
                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;