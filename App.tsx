
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import JudgeDashboard from './pages/judge/Dashboard';
import JudgeCauseList from './pages/judge/CauseList';
import LiveHearing from './pages/judge/LiveHearing';
import LawyerDashboard from './pages/lawyer/Dashboard';
import ReadinessForm from './pages/lawyer/ReadinessForm';
import AdminDashboard from './pages/admin/Dashboard';
import RoleSelector from './pages/RoleSelector';
import Layout from './components/layout/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelector />} />
        
        {/* Judge Routes */}
        <Route element={<Layout role="JUDGE" />}>
          <Route path="/judge/dashboard" element={<JudgeDashboard />} />
          <Route path="/judge/cause-list" element={<JudgeCauseList />} />
          <Route path="/judge/hearing/:hearingId/live" element={<LiveHearing />} />
        </Route>

        {/* Lawyer Routes */}
        <Route element={<Layout role="LAWYER" />}>
          <Route path="/lawyer/dashboard" element={<LawyerDashboard />} />
          <Route path="/readiness/:hearingId" element={<ReadinessForm />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<Layout role="ADMIN" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
