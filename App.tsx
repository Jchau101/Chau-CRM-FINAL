
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Pipeline } from './pages/Pipeline';
import { Leads } from './pages/Leads';
import { Tasks } from './pages/Tasks';
import { Billing } from './pages/Billing';
import { Settings } from './pages/Settings';
import { Landing } from './pages/Landing';
import { AuthPage } from './pages/Auth';
import { AuthProvider, useAuth } from './context/AuthContext';

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] text-sm text-neutral-500">
        Loading your workspace...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const AppShell: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#fcfcfc]">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen relative overflow-y-auto">
        <div className="max-w-7xl mx-auto p-10 pb-24">
          <Routes>
            {/* Nested routes under /app/* use relative paths */}
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="leads" element={<Leads />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/app/*"
            element={
              <RequireAuth>
                <AppShell />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

