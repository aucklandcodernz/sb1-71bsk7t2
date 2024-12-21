import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './components/auth/AuthProvider';
import { MobileNav } from './components/MobileNav';
import { MobileDashboard } from './components/MobileDashboard';
import { HelpButton } from './components/help/HelpButton';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import LeaveManagement from './pages/LeaveManagement';
import TimeAttendance from './pages/TimeAttendance';
import Documents from './pages/Documents';
import Training from './pages/Training';
import Payroll from './pages/Payroll';
import HealthSafety from './pages/HealthSafety';
import Compliance from './pages/Compliance';
import Settings from './pages/Settings';
import TeamAccess from './pages/TeamAccess';
import ExpenseManagement from './pages/ExpenseManagement';
import RosterManagement from './pages/RosterManagement';
import Security from './pages/Security';
import { Toaster } from 'react-hot-toast';

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const isMobile = window.innerWidth < 1024;

  return (
    <Router>
      <AuthProvider>
        <div className="flex min-h-screen bg-gray-50">
          {isAuthenticated && !isMobile && <Sidebar />}
          {isAuthenticated && isMobile && <MobileNav />}
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/" element={
                <ProtectedRoute>
                  {isMobile ? <MobileDashboard /> : <Dashboard />}
                </ProtectedRoute>
              } />
              <Route path="/employees" element={
                <ProtectedRoute 
                  requiredPermission="manage_employees"
                  allowedRoles={['super_admin', 'hr_manager', 'team_leader']}
                >
                  <Employees />
                </ProtectedRoute>
              } />
              <Route path="/leave" element={
                <ProtectedRoute>
                  <LeaveManagement />
                </ProtectedRoute>
              } />
              <Route path="/time" element={
                <ProtectedRoute>
                  <TimeAttendance />
                </ProtectedRoute>
              } />
              <Route path="/documents" element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              } />
              <Route path="/training" element={
                <ProtectedRoute>
                  <Training />
                </ProtectedRoute>
              } />
              <Route path="/payroll" element={
                <ProtectedRoute 
                  requiredPermission="manage_payroll"
                  allowedRoles={['super_admin', 'payroll_admin']}
                >
                  <Payroll />
                </ProtectedRoute>
              } />
              <Route path="/health-safety" element={
                <ProtectedRoute>
                  <HealthSafety />
                </ProtectedRoute>
              } />
              <Route path="/compliance" element={
                <ProtectedRoute 
                  requiredPermission="manage_compliance"
                  allowedRoles={['super_admin', 'hr_manager', 'compliance_officer']}
                >
                  <Compliance />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute 
                  requiredPermission="manage_settings"
                  allowedRoles={['super_admin']}
                >
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/team-access" element={
                <ProtectedRoute 
                  requiredPermission="manage_team"
                  allowedRoles={['super_admin', 'hr_manager']}
                >
                  <TeamAccess />
                </ProtectedRoute>
              } />
              <Route path="/expenses" element={
                <ProtectedRoute>
                  <ExpenseManagement />
                </ProtectedRoute>
              } />
              <Route path="/roster" element={
                <ProtectedRoute 
                  requiredPermission="manage_roster"
                  allowedRoles={['super_admin', 'hr_manager', 'team_leader']}
                >
                  <RosterManagement />
                </ProtectedRoute>
              } />
              <Route path="/security" element={
                <ProtectedRoute 
                  requiredPermission="manage_security"
                  allowedRoles={['super_admin']}
                >
                  <Security />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
        {isAuthenticated && <HelpButton />}
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;