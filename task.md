# 🚀 Phase 2: Comprehensive API Integration Plan

## 🌐 1. Public Marketing & Indexing Routes
- `[/]` **Global Platform Connections**
  - `[ ]` **Platform Homepage (`/`)**
    - `[ ]` Implement `GET /api/global/search` to query articles across all tenants.
    - `[ ]` Update `Zustand` to manage dynamic 3D Journal Slider state with live data.
  - `[ ]` **Articles in Press (`/early-access`)**
    - `[ ]` Implement `GET /api/global/early-access` to fetch `PUBLISHED` articles with `issue_id: null`.
  - `[ ]` **Journal Application Form (`/basvurular/dergi`)**
    - `[ ]` Connect form submission to `POST /api/applications/journal`.
    - `[]` Add validation states and success/error toasts.

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

## 🛠️ 3. Secured Role-Based Dashboards
- `[ ]` **Shared Spaces**
  - `[ ]` **Profile (`/profile`)**: Connect `PUT /api/user/profile` for IBAN and contact updates.
  - `[ ]` **Messages (`/messages`)**: Implement `GET /api/messages` handling encrypted cross-role masking.
- `[ ]` **Executive Editor (`/editor`)**
  - `[ ]` **Overview**: Fetch `GET /api/editor/analytics` for Recharts data.
  - `[ ]` **Articles**: Fetch `GET /api/editor/articles?status=...`.
  - `[ ]` **Issues**: Implement `POST /api/editor/issues/create` (multipart/form-data).
  - `[ ]` **Settings**: Implement `PUT /api/journal/settings`.
- `[ ]` **Author/Researcher (`/yazar`)**
  - `[ ]` **Submissions**: Fetch `GET /api/author/submissions`.
  - `[ ]` **Submit Wizard**: Connect multi-step cache to `POST /api/author/submit` (multipart).
  - `[ ]` **Tracker**: Implement `POST /api/author/withdraw/:id`.
- `[ ]` **Peer Reviewer (`/reviewer`)**
  - `[ ]` **Evaluate**: Implement strict Double-Blind Interceptor on `GET /api/reviewer/article/:id`.
  - `[ ]` **Submit Score**: Connect `POST /api/reviewer/evaluate/:id`.
- `[ ]` **Layout Editor (`/layout`)**
  - `[ ]` **Proofs**: Implement `POST /api/layout/upload-proof`.

## 📱 4. Global UI & Responsiveness Optimization (تزبيط الـ Responsive)
- `[ ]` **Mobile Compatibility Audit**
  - `[ ]` Ensure the 3D Journal Slider on the Homepage is fully responsive on mobile screens.
  - `[ ]` Fix table overflow and scrolling issues on Dashboard data tables (Editor & Author tables).
  - `[ ]` Verify the Navigation Menu collapses correctly into the hamburger menu on smaller screens.
  - `[ ]` Ensure dual-language forms and wizard steppers (`/yazar/submit-wizard`) stack gracefully on mobile devices.

## 🔔 5. Real-Time Notifications & Activity Feed (Refined Architecture)
- `[ ]` **Notification Center (`/notify` / or integrated into Header)**
  - `[ ]` Fetch `GET /api/notifications?limit=15` to populate the bell icon dropdown with recent activities and support infinite scroll.
  - `[ ]` Implement real-time push connection (**Server-Sent Events / SSE**) for instant updates without page refresh.
  - `[ ]` Mark individual notifications as read via `PATCH /api/notifications/:id/read`.
  - `[ ]` **[NEW]** Mark ALL notifications as read via `PATCH /api/notifications/read-all`.
- `[ ]` **Dashboard Activities (`/dashboard/activity`)**
  - `[ ]` Aggregate notifications and events into a single chronologically sorted feed, paginated for performance.
  - `[ ]` **[NEW]** Inject visual Context Tags (e.g., "Role: Reviewer", "Type: System Alert") so the user knows exactly why they are receiving the alert.
  - `[ ]` Trigger specific UI states based on notification type (e.g., pulsing/flashing the 'Pending Reviews' button if a new review is assigned).