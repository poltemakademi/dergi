# 🚀 Phase 2: Comprehensive API Integration Plan

<!--
## 🌐 1. Public Marketing & Indexing Routes
- `[x]` **Global Platform Connections**
  - `[x]` **Platform Homepage (`/`)**
    - `[x]` Implement `GET /api/global/search` to query articles across all tenants.
    - `[x]` Update `Zustand` to manage dynamic 3D Journal Slider state with live data.
  - `[x]` **Articles in Press (`/early-access`)**
    - `[x]` Implement `GET /api/global/early-access` to fetch `PUBLISHED` articles with `issue_id: null`.
  - `[x]` **Journal Application Form (`/basvurular/dergi`)**
    - `[x]` Connect form submission to `POST /api/applications/journal`.
    - `[x]` Add validation states and success/error toasts.

## 🏛️ 2. Individual Tenant Gateway (Public Journal Pages)
- `[ ]` **Journal Dynamic Routing (`/:tenant_slug`)**
  - `[ ]` **Journal Homepage (`/`)**
    - `[ ]` Fetch `GET /api/tenant/:slug/metadata` on mount to load brand colors, logos, and featured articles.
  - `[ ]` **Current Issue (`/current`)**
    - `[ ]` Fetch `GET /api/tenant/:slug/issues/latest`.
  - `[ ]` **Issue Archives (`/archives`)**
    - `[ ]` Fetch `GET /api/tenant/:slug/issues/archive` and map to tree-view.
  - `[ ]` **Article Detail Page (`/article/:id`)**
    - `[ ]` Fetch `GET /api/tenant/:slug/articles/:id`.
    - `[ ]` Implement `POST /api/metrics/download/:id` for PDF download analytics.
  - `[ ]` **CMS Pages (`/policies` & `/board`)**
    - `[ ]` Fetch `GET /api/tenant/:slug/pages/:page_alias`.
                 later-->
## 🛠️ 3. Secured Role-Based Dashboards
- `[ ]` **Shared Spaces**
  - `[x]` **Profile (`/profile`)**: Connect `PUT /api/user/profile` for IBAN and contact updates. (Implemented Role-Based Gate and mock fallback)
  - `[x]` **Messages (`/messages`)**: Implement `GET /api/messages` handling encrypted cross-role masking. (Built Master-Detail UI and dynamic role-specific mock messages)
- `[x]` **Executive Editor (`/editor`)**
  - `[x]` **Overview**: Fetch `GET /api/editor/analytics` for Recharts data. (Mock Fallback Added)
  - `[x]` **Articles**: Fetch `GET /api/editor/articles?status=...`. (Mock Fallback Added)
  - `[x]` **Issues**: Implement `POST /api/editor/issues/create` (multipart/form-data). (Mock Fallback Added)
  - `[x]` **Settings**: Implement `PUT /api/journal/settings`. (Mock Save Added)
- `[x]` **Author/Researcher (`/yazar`)**
  - `[x]` **Submissions**: Fetch `GET /api/author/submissions`. (Mock Fallback Added)
  - `[x]` **Submit Wizard**: Connect multi-step cache to `POST /api/author/submit` (multipart). (Mock Save Added)
  - `[x]` **Tracker**: Implement `POST /api/author/withdraw/:id`. (Mock Withdraw Added)
- `[x]` **Peer Reviewer (`/reviewer`)**
  - `[x]` **Evaluate**: Implement strict Double-Blind Interceptor on `GET /api/reviewer/article/:id`. (Mock Load Added)
  - `[x]` **Submit Score**: Connect `POST /api/reviewer/evaluate/:id`. (Mock Submit Added)
- `[x]` **Layout Editor (`/layout`)**
  - `[x]` **Proofs**: Implement `POST /api/layout/upload-proof`. (Mock Upload Added)

## 📱 4. Global UI & Responsiveness Optimization (تزبيط الـ Responsive)
- `[x]` **Mobile Compatibility Audit**
  - `[x]` Ensure the Marquee and Hero on Homepage is fully responsive on mobile screens.
  - `[x]` Fix table overflow and scrolling issues on Dashboard data tables (Editor & Author tables).
  - `[x]` Verify the Navigation Menu collapses correctly into the hamburger menu on smaller screens.
  - `[x]` Ensure dual-language forms and wizard steppers (`/yazar/submit-wizard`) stack gracefully on mobile devices.

## 🔔 5. Real-Time Notifications & Activity Feed (Refined Architecture)
- `[x]` **Notification Center (`/notify` / or integrated into Header)**
  - `[x]` Fetch `GET /api/notifications?limit=15` to populate the bell icon dropdown with recent activities and support infinite scroll.
  - `[x]` Implement real-time push connection (**Server-Sent Events / SSE**) for instant updates without page refresh.
  - `[x]` Mark individual notifications as read via `PATCH /api/notifications/:id/read`.
  - `[x]` **[NEW]** Mark ALL notifications as read via `PATCH /api/notifications/read-all`.
- `[x]` **Dashboard Activities (`/dashboard/activity`)**
  - `[x]` Aggregate notifications and events into a single chronologically sorted feed, paginated for performance.
  - `[x]` **[NEW]** Inject visual Context Tags (e.g., "Role: Reviewer", "Type: System Alert") so the user knows exactly why they are receiving the alert.
  - `[x]` Trigger specific UI states based on notification type (e.g., pulsing/flashing the 'Pending Reviews' button if a new review is assigned).