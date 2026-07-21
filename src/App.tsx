import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import JournalLayout from './layouts/JournalLayout';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardGuard from './components/DashboardGuard';
import RoleGuard from './components/RoleGuard';

// Public Pages
import Home from './pages/public/Home';
import SystemFeatures from './pages/public/SystemFeatures';
import EarlyAccess from './pages/public/EarlyAccess';
import Integrations from './pages/public/Integrations';
import Auth from './pages/public/Auth';
import About from './pages/public/About';
import Directory from './pages/public/Directory';
import Search from './pages/public/Search';
import Applications from './pages/public/Applications';
import DoiApplication from './pages/public/DoiApplication';

// Journal Pages
import JournalHome from './pages/journal/JournalHome';
import CurrentIssue from './pages/journal/CurrentIssue';
import Archives from './pages/journal/Archives';
import ArticleDetail from './pages/journal/ArticleDetail';
import CMSPage from './pages/journal/CMSPage';
import AboutJournal from './pages/journal/AboutJournal';
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
import Activity from './pages/dashboard/Activity';

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

// Super Admin Pages
import SystemOverview from './pages/dashboard/admin/SystemOverview';
import UserManagement from './pages/dashboard/admin/UserManagement';
import JournalManagement from './pages/dashboard/admin/JournalManagement';

import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <Toaster position="bottom-center" richColors />
      <BrowserRouter>
        <Routes>
          {/* --- 1. Global Platform Routes (No-Auth) --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/search" element={<Search />} />
            <Route path="/sistem-ozellikleri" element={<SystemFeatures />} />
            <Route path="/entegrasyonlar" element={<Integrations />} />
            <Route path="/early-access" element={<EarlyAccess />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/basvurular/dergi" element={<Applications />} />
            <Route path="/basvurular/doi" element={<DoiApplication />} />
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
            <Route path="activity" element={<Activity />} />

            {/* Editor Routes */}
            <Route path="editor/overview" element={<RoleGuard allowedRoles={['editor', 'super_admin']}><EditorOverview /></RoleGuard>} />
            <Route path="editor/articles" element={<RoleGuard allowedRoles={['editor', 'super_admin']}><EditorArticles /></RoleGuard>} />
            <Route path="editor/issues" element={<RoleGuard allowedRoles={['editor', 'super_admin']}><EditorIssues /></RoleGuard>} />
            <Route path="editor/settings" element={<RoleGuard allowedRoles={['editor', 'super_admin']}><EditorSettings /></RoleGuard>} />

            {/* Author Routes */}
            <Route path="yazar/submissions" element={<RoleGuard allowedRoles={['author']}><AuthorSubmissions /></RoleGuard>} />
            <Route path="yazar/submit-wizard" element={<RoleGuard allowedRoles={['author']}><AuthorSubmitWizard /></RoleGuard>} />
            <Route path="yazar/track/:id" element={<RoleGuard allowedRoles={['author']}><AuthorTrack /></RoleGuard>} />

            {/* Reviewer Routes */}
            <Route path="reviewer/assigned" element={<RoleGuard allowedRoles={['reviewer']}><ReviewerAssigned /></RoleGuard>} />
            <Route path="reviewer/evaluate/:id" element={<RoleGuard allowedRoles={['reviewer']}><ReviewerEvaluate /></RoleGuard>} />

            {/* Layout Editor Routes */}
            <Route path="layout/queue" element={<RoleGuard allowedRoles={['layout_editor']}><LayoutQueue /></RoleGuard>} />
            <Route path="layout/proofs" element={<RoleGuard allowedRoles={['layout_editor']}><LayoutProofs /></RoleGuard>} />
            <Route path="layout/proofs/:id" element={<RoleGuard allowedRoles={['layout_editor']}><LayoutProofs /></RoleGuard>} />

            {/* Super Admin Routes */}
            <Route path="admin/system" element={<RoleGuard allowedRoles={['super_admin']}><SystemOverview /></RoleGuard>} />
            <Route path="admin/users" element={<RoleGuard allowedRoles={['super_admin']}><UserManagement /></RoleGuard>} />
            <Route path="admin/journals" element={<RoleGuard allowedRoles={['super_admin']}><JournalManagement /></RoleGuard>} />
          </Route>

          {/* --- 3. Individual Tenant Gateway (Journal Pages) --- */}
          <Route path="/:tenant_slug" element={<JournalLayout />}>
            <Route index element={<AboutJournal />} />
            <Route path="home" element={<JournalHome />} />
            <Route path="current" element={<CurrentIssue />} />
            <Route path="archives" element={<Archives />} />
            <Route path="article/:id" element={<ArticleDetail />} />
            <Route path="policies" element={<CMSPage type="policies" />} />
            <Route path="board" element={<CMSPage type="board" />} />
            <Route path="am" element={<AboutJournal />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
