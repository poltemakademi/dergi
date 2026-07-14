import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import JournalLayout from './layouts/JournalLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import SystemFeatures from './pages/public/SystemFeatures';
import EarlyAccess from './pages/public/EarlyAccess';
import Integrations from './pages/public/Integrations';
import Auth from './pages/public/Auth';
import About from './pages/public/About';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- 1. Global Platform Routes (No-Auth) --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sistem-ozellikleri" element={<SystemFeatures />} />
          <Route path="/entegrasyonlar" element={<Integrations />} />
          <Route path="/early-access" element={<EarlyAccess />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* --- 2. Individual Tenant Gateway (Journal Pages) --- */}
        <Route path="/:tenant_slug" element={<JournalLayout />}>
          <Route index element={<div>Journal Homepage</div>} />
          <Route path="current" element={<div>Current Issue</div>} />
          <Route path="archives" element={<div>Archives</div>} />
          <Route path="article/:id" element={<div>Article Details</div>} />
        </Route>

        {/* --- 3. Secured Role-Based Dashboards --- */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/role-selector" replace />} />
          <Route path="role-selector" element={<div>Role Selector Workspace</div>} />
          <Route path="profile" element={<div>User Profile</div>} />

          {/* Editor Routes */}
          <Route path="editor/overview" element={<div>Editor Analytics</div>} />
          <Route path="editor/articles" element={<div>Manuscript Pool</div>} />

          {/* Author Routes */}
          <Route path="yazar/submissions" element={<div>My Articles</div>} />
          <Route path="yazar/submit-wizard" element={<div>Submission Engine</div>} />

          {/* Reviewer Routes */}
          <Route path="reviewer/assigned" element={<div>Reviewer Queue</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
