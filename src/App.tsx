import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import JournalLayout from './layouts/JournalLayout';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardGuard from './components/DashboardGuard';

// Public Pages
import Home from './pages/public/Home';
import SystemFeatures from './pages/public/SystemFeatures';
import EarlyAccess from './pages/public/EarlyAccess';
import Integrations from './pages/public/Integrations';
import Auth from './pages/public/Auth';
import About from './pages/public/About';
import Directory from './pages/public/Directory';
import JournalHome from './pages/journal/JournalHome';
import AuthorApplications from './pages/public/AuthorApplications';
import TechnicalDocs from './pages/public/TechnicalDocs';
import ApiReference from './pages/public/ApiReference';
import EthicalGuidelines from './pages/public/EthicalGuidelines';
import OpenAccessPolicy from './pages/public/OpenAccessPolicy';
import Kvkk from './pages/public/Kvkk';
import SalesAgreement from './pages/public/SalesAgreement';

// Dashboard Shared Pages
import RoleSelector from './pages/dashboard/RoleSelector';
import Profile from './pages/dashboard/Profile';
import Messages from './pages/dashboard/Messages';

// Editor Pages
import EditorOverview from './pages/dashboard/editor/Overview';
import EditorArticles from './pages/dashboard/editor/Articles';
import EditorIssues from './pages/dashboard/editor/Issues';
import EditorSettings from './pages/dashboard/editor/Settings';

// Author Pages
import AuthorSubmissions from './pages/dashboard/author/Submissions';
import AuthorSubmitWizard from './pages/dashboard/author/SubmitWizard';
import AuthorTrack from './pages/dashboard/author/Track';

// Reviewer Pages
import ReviewerAssigned from './pages/dashboard/reviewer/Assigned';
import ReviewerEvaluate from './pages/dashboard/reviewer/Evaluate';

// Layout Editor Pages
import LayoutQueue from './pages/dashboard/layout/Queue';
import LayoutProofs from './pages/dashboard/layout/Proofs';

import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* --- 1. Global Platform Routes (No-Auth) --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/sistem-ozellikleri" element={<SystemFeatures />} />
          <Route path="/entegrasyonlar" element={<Integrations />} />
          <Route path="/early-access" element={<EarlyAccess />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/author-applications" element={<AuthorApplications />} />
          <Route path="/technical-docs" element={<TechnicalDocs />} />
          <Route path="/api-reference" element={<ApiReference />} />
          <Route path="/ethical-guidelines" element={<EthicalGuidelines />} />
          <Route path="/open-access-policy" element={<OpenAccessPolicy />} />
          <Route path="/kvkk" element={<Kvkk />} />
          <Route path="/sales-agreement" element={<SalesAgreement />} />
        </Route>

        {/* --- 2. Secured Role-Based Dashboards --- */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardGuard />} />
          
          {/* Shared Routes */}
          <Route path="role-selector" element={<RoleSelector />} />
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Messages />} />

          {/* Editor Routes */}
          <Route path="editor/overview" element={<EditorOverview />} />
          <Route path="editor/articles" element={<EditorArticles />} />
          <Route path="editor/issues" element={<EditorIssues />} />
          <Route path="editor/settings" element={<EditorSettings />} />

          {/* Author Routes */}
          <Route path="yazar/submissions" element={<AuthorSubmissions />} />
          <Route path="yazar/submit-wizard" element={<AuthorSubmitWizard />} />
          <Route path="yazar/track/:id" element={<AuthorTrack />} />

          {/* Reviewer Routes */}
          <Route path="reviewer/assigned" element={<ReviewerAssigned />} />
          <Route path="reviewer/evaluate/:id" element={<ReviewerEvaluate />} />

          {/* Layout Editor Routes */}
          <Route path="layout/queue" element={<LayoutQueue />} />
          <Route path="layout/proofs" element={<LayoutProofs />} />
        </Route>

        {/* --- 3. Individual Tenant Gateway (Journal Pages) --- */}
        <Route path="/:tenant_slug" element={<JournalLayout />}>
          <Route index element={<JournalHome />} />
          <Route path="current" element={<div>Current Issue</div>} />
          <Route path="archives" element={<div>Archives</div>} />
          <Route path="article/:id" element={<div>Article Details</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
