
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Pipeline } from './pages/Pipeline';
import { Leads } from './pages/Leads';
import { Billing } from './pages/Billing';
import { Settings } from './pages/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#fcfcfc]">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen relative overflow-y-auto">
          <div className="max-w-7xl mx-auto p-10 pb-24">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
