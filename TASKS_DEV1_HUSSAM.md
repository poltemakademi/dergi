# 🛠️ TASKS — DEV 1 (Hussam)
## Core Infrastructure & Editorial Flow

> **Scope:** Infrastructure hooks, shared UI components, Editor Dashboard, Super Admin planning  
> **Assigned To:** Hussam  
> **Tracker Created:** July 20, 2026  
> **Source:** `DASHBOARD_INTEGRATION_PLAN.md` v1.0

---

## Phase 1: Infrastructure Setup (Day 1 — BLOCKING)

> [!IMPORTANT]
> **All Phase 1 items are BLOCKING.** Dev 2 cannot begin dashboard integration until these hooks and utilities are merged into `main`.

### Custom Hooks

- [ ] **1.1** Create `src/hooks/useApiQuery.ts`
  - Implement `useApiQuery<T>({ url, params, enabled, transform })` hook
  - Must return `{ data, isLoading, error, refetch }`
  - **NO mock fallback** — errors must propagate as real errors
  - `enabled` flag to prevent fetching before dependencies are ready
  - `transform` callback for data shaping (e.g., blinding filter)
  - Dependency-tracked `fetchData` via `useCallback` keyed on `url` + serialized `params`

- [ ] **1.2** Create `src/hooks/useApiMutation.ts`
  - Implement `useApiMutation<TPayload>(url, options)` hook
  - Support dynamic URL via `url: string | ((payload) => string)`
  - Auto-integrated Sonner feedback:
    - `toast.loading('Processing…')` on initiation
    - `toast.success()` on completion (with custom `successMessage`)
    - `toast.error()` on failure (with custom `errorMessage`)
  - Return `{ mutate, isLoading }` for button disable state
  - Support `method: 'post' | 'put' | 'patch' | 'delete'`
  - Support `onSuccess` callback for post-mutation actions (e.g., `refetch`, `navigate`)

### Route Protection

- [ ] **1.3** Create `src/components/RoleGuard.tsx`
  - Accept `allowedRoles: Role[]` prop
  - Read `activeRole` from `useAuthStore()`
  - Redirect to `/dashboard/role-selector` if role not in allowed list
  - Render `children` if authorized

- [ ] **1.4** Update `src/App.tsx` — wrap all role-specific routes with `<RoleGuard>`
  - Editor routes → `allowedRoles={['editor', 'super_admin']}`
  - Author routes → `allowedRoles={['author']}`
  - Reviewer routes → `allowedRoles={['reviewer']}`
  - Layout routes → `allowedRoles={['layout_editor']}`

### Axios Interceptor Hardening

- [ ] **1.5** Verify `src/services/api/client.ts` interceptor handles all error codes
  - `400` → pass through (component handles)
  - `401` → auto-logout + redirect to `/auth` (already exists — verify)
  - `403` → pass through with `toast.error('Permission denied')`
  - `404` → pass through (component handles with empty state)
  - `409` → pass through
  - `422` → pass through with validation details
  - `429` → `toast.warning('Too many requests')`
  - `500` → `toast.error('Server error')`
  - Network Error → `toast.error('Network unavailable')`

### ✅ Phase 1 Testing Checkpoint

```
✅ useApiQuery returns { data, isLoading, error, refetch } correctly
✅ useApiMutation triggers toast.loading → toast.success/error automatically
✅ RoleGuard redirects unauthorized users to /dashboard/role-selector
✅ RoleGuard allows authorized users to render children
✅ Axios interceptor handles 400, 401, 403, 404, 500, and network errors
```

---

## Phase 2: Shared UI/UX Components (Day 1–2)

### Sonner Notification Matrix

- [ ] **2.1** Document and enforce the global notification standard:
  - **Data Mutation** → `toast.loading()` → `toast.success/error()` (handled by `useApiMutation`)
  - **Navigation** → No toast
  - **Data Fetch** → Skeleton loader (no toast)
  - **File Upload** → `toast.loading('Uploading…')` → `toast.success/error()`
  - **Destructive Action** → Confirmation modal → then `toast.loading()` → `toast.success/error()`
  - **Filter/Search** → Debounce 300ms → inline spinner → silent render or `toast.error()`

### Loading Skeleton Components

- [ ] **2.2** Create `src/components/skeletons/TableSkeleton.tsx`
  - Props: `rows: number`, `cols: number`
  - Usage: Editor Articles, Author Submissions, Layout Queue

- [ ] **2.3** Create `src/components/skeletons/CardSkeleton.tsx`
  - Props: `count: number`
  - Usage: Editor Overview KPIs, Reviewer Assigned Queue

- [ ] **2.4** Create `src/components/skeletons/FormSkeleton.tsx`
  - Props: `fields: number`
  - Usage: Profile, Settings

- [ ] **2.5** (Optional) Create `src/components/skeletons/InboxSkeleton.tsx`
  - Usage: Messages page

### Shared Pages Integration

- [ ] **2.6** Integrate `src/pages/dashboard/RoleSelector.tsx`
  - Replace `mockWorkspaces` array with `useApiQuery({ url: '/api/user/workspaces' })`
  - Each card: real role, tenant name, slug, pending count
  - `handleSelect()` → `setActiveRole()` + `setActiveTenant()` (already working)
  - Loading state: `<CardSkeleton count={3} />`
  - Error state: inline error banner with retry

- [ ] **2.7** Verify `src/pages/dashboard/Profile.tsx`
  - Already mostly integrated
  - Remove `(Local MOCK)` toast suffix from save handler
  - Confirm `GET /api/user/profile` + `PUT /api/user/profile` work without mock fallback

- [ ] **2.8** Verify `src/pages/dashboard/Activity.tsx`
  - Already wired via `useSSE` hook
  - Confirm `markAllAsRead()`, `clearHistory()`, `markAsRead(id)` hit real endpoints
  - Enable SSE stream `/api/notifications/stream` when backend supports it (currently commented out)

- [ ] **2.9** Integrate `src/pages/dashboard/Messages.tsx` — Wire 6 non-functional elements:
  - [ ] **2.9a** Add `activeFolder` state → `GET /api/messages?folder=inbox|sent|starred`
  - [ ] **2.9b** Add debounced search → `GET /api/messages?search={query}`
  - [ ] **2.9c** Wire message click → `PATCH /api/messages/:id/read`
  - [ ] **2.9d** Wire recipients dropdown → `GET /api/messages/recipients` (dynamic, role-based)
  - [ ] **2.9e** Wire "Send" button → remove local simulation fallback → real `POST /api/messages`
  - [ ] **2.9f** Wire "Reply" button → open compose pre-filled with `Re: {subject}`, original sender, quoted body
  - [ ] **2.9g** Wire "Star" toggle → `PATCH /api/messages/:id/star`
  - [ ] **2.9h** Wire "Delete" button → `DELETE /api/messages/:id` + remove from local state + toast

> [!NOTE]
> Messages page has a **double-blind constraint**: when `activeRole === 'reviewer'`, the backend must mask sender identities. This is a backend responsibility — frontend only renders what the API returns. Coordinate with Dev 2 to ensure consistency.

### ✅ Phase 2 Testing Checkpoint

```
✅ All skeleton components render with correct dimensions
✅ Role Selector shows real journal memberships from API
✅ Profile save persists to database without mock fallback
✅ Activity feed shows real notifications
✅ Messages: compose, send, receive, reply, star, delete all work end-to-end
✅ Reviewer's message view masks sender identities (backend-driven)
```

---

## Phase 3: Editor Dashboard Integration (Day 3–4)

### Editor Overview

- [ ] **3.1** Integrate `src/pages/dashboard/editor/Overview.tsx`
  - Replace mock stats fallback with `useApiQuery({ url: '/api/editor/analytics' })`
  - Wire 4 KPI cards: Total Submissions, Acceptance Rate, Avg Review Time, Total Downloads
  - Wire Velocity Bar Chart (12 monthly values from `analytics.velocity`)
  - Wire Pipeline Distribution (4 progress bars from `analytics.distribution`)
  - Loading state: `<CardSkeleton count={4} />` for KPIs
  - This page is **read-only** — no mutations

### Editor Articles

- [ ] **3.2** Integrate `src/pages/dashboard/editor/Articles.tsx`
  - [ ] **3.2a** Add `searchQuery` state + debounced search → `GET /api/editor/articles?search={query}&status={tab}`
  - [ ] **3.2b** Add filter dropdown with status checkboxes: `PENDING_PRE_CHECK`, `IN_REVIEW`, `REVISION_REQUIRED`, `ACCEPTED`
  - [ ] **3.2c** Wire pagination: `page` + `totalPages` state → `GET /api/editor/articles?page=N&limit=10`
  - [ ] **3.2d** Wire row action menu (`⋮` MoreVertical button):
    - **Assign Reviewer** → `POST /api/editor/articles/:id/assign-reviewer` with reviewer dropdown from `GET /api/editor/reviewers`
    - **Send to Revision** → `PATCH /api/editor/articles/:id/status` body: `{ status: 'REVISION_REQUIRED' }`
    - **Accept** → `PATCH /api/editor/articles/:id/status` body: `{ status: 'ACCEPTED' }`
    - **Reject** → `PATCH /api/editor/articles/:id/status` body: `{ status: 'REJECTED' }`
    - **View PDF** → open PDF in new tab
  - [ ] **3.2e** Sonner feedback per action:
    - Assign: `toast.loading('Assigning…')` → `toast.success('Reviewer assigned')`
    - Status: `toast.success('Status updated to {newStatus}')`
    - Error: `toast.error('Failed to update: {error.message}')`
  - Loading state: `<TableSkeleton rows={5} cols={6} />`

### Editor Issues (Issue Studio)

- [ ] **3.3** Integrate `src/pages/dashboard/editor/Issues.tsx`
  - [ ] **3.3a** Fetch accepted articles: `GET /api/editor/articles?status=ACCEPTED&not_in_issue=true`
  - [ ] **3.3b** Implement drag-and-drop (using `@dnd-kit/core` or native HTML5 drag API)
    - Drag article cards from left panel → TOC dropzone
    - Allow reorder within TOC
    - Each item has a remove (×) button
  - [ ] **3.3c** Wire "Upload Generic PDF" dropzone → hidden `<input type="file" accept=".pdf">`
  - [ ] **3.3d** Wire "Upload Cover Image" dropzone → hidden `<input type="file" accept=".jpg,.png">`
  - [ ] **3.3e** Wire "Publish Issue" button:
    - Remove `setTimeout` simulation
    - `POST /api/editor/issues/create` with `multipart/form-data`
    - Payload: `{ articles: string[], genericPdf: File, coverImage: File, volume, issueNumber }`
    - Sonner: `toast.loading('Publishing issue…')` → `toast.success('Issue published!')` / `toast.error()`

### Editor Settings

- [ ] **3.4** Integrate `src/pages/dashboard/editor/Settings.tsx`
  - Fetch real settings on mount: `GET /api/journal/settings`
  - Remove hardcoded initial values
  - Wire "Save All Settings": `PUT /api/journal/settings` → remove mock fallback
  - Loading state: `<FormSkeleton fields={7} />`

### ✅ Phase 3 Testing Checkpoint

```
✅ Analytics KPIs reflect real database aggregates
✅ Article table loads real submissions with working search and pagination
✅ Action menu: Assign Reviewer / Accept / Reject / Send to Revision all trigger real APIs
✅ Issue composer accepts drag-and-drop articles + file uploads
✅ "Publish Issue" creates a real issue record with linked articles
✅ Settings form loads and saves real journal configuration
✅ All mutations show Sonner feedback
```

---

## Phase 4: Super Admin Dashboard (Planning)

> [!NOTE]
> The `super_admin` role is referenced in `DashboardGuard` and route protection, but **no admin pages exist yet**. This phase covers planning and scaffolding only.

- [ ] **4.1** Define Super Admin page requirements:
  - System-wide analytics (cross-journal)
  - User management (CRUD on `profiles` + `journal_members`)
  - Journal management (create/edit/deactivate journals)
  - System settings / configuration
  - Audit logs

- [ ] **4.2** Create route scaffolding in `src/App.tsx`:
  - `/dashboard/admin/system` → SystemOverview placeholder
  - `/dashboard/admin/users` → UserManagement placeholder
  - `/dashboard/admin/journals` → JournalManagement placeholder
  - Wrap with `<RoleGuard allowedRoles={['super_admin']}>`

- [ ] **4.3** Define required backend endpoints:
  - `GET /api/admin/analytics` → Cross-journal metrics
  - `GET /api/admin/users` → Paginated user list
  - `PATCH /api/admin/users/:id/role` → Role assignment
  - `GET /api/admin/journals` → Journal list
  - `POST /api/admin/journals` → Create journal
  - `PUT /api/admin/journals/:id` → Edit journal

- [ ] **4.4** Create placeholder page components with skeleton UIs

---

## Phase 5: Cleanup & Hardening (Shared with Dev 2)

- [ ] **5.1** Remove ALL mock fallback arrays from pages you own (Editor, Shared)
- [ ] **5.2** Remove `(Local Mock)` and `(Local MOCK)` toast suffixes
- [ ] **5.3** Remove `console.warn('Backend unavailable...')` fallback patterns
- [ ] **5.4** Run full TypeScript build: `npm run build` — zero errors
- [ ] **5.5** Audit `any` types in files you own — replace with proper interfaces
- [ ] **5.6** Cross-role penetration test: log in as Reviewer → attempt Editor routes → verify redirect
- [ ] **5.7** Verify every button produces Sonner feedback (no silent clicks)

---

## 🤝 Handshake Points

These are coordination points where Dev 1 and Dev 2 must sync to avoid blocking or conflicts.

| # | What | Who Produces | Who Consumes | Sync Trigger |
|---|------|-------------|-------------|-------------|
| **H1** | `useApiQuery` hook | **Dev 1** | Dev 2 | ⚠️ **BLOCKER** — Dev 2 cannot start Author/Reviewer integration until this hook is merged to `main` |
| **H2** | `useApiMutation` hook | **Dev 1** | Dev 2 | ⚠️ **BLOCKER** — Dev 2 needs this for Submit Wizard, Review Submit, Proof Upload |
| **H3** | `RoleGuard` component | **Dev 1** | Dev 2 | ⚠️ **BLOCKER** — Dev 2 needs this to wrap Author/Reviewer/Layout routes |
| **H4** | Skeleton components | **Dev 1** | Dev 2 | ⚠️ **BLOCKER** — Dev 2 needs `TableSkeleton`, `CardSkeleton` for loading states |
| **H5** | `blindingFilter.ts` utility | **Dev 2** | Dev 1 | Dev 1 may need this for Messages page double-blind constraint |
| **H6** | `App.tsx` route updates | **Dev 1** | Dev 2 | Dev 1 owns `App.tsx`. Dev 2 must NOT modify this file. Instead, communicate any route changes needed to Dev 1 |
| **H7** | Messages double-blind | **Dev 1** (frontend) + **Backend** | Dev 2 (awareness) | Dev 1 integrates Messages. Backend masks reviewer identities. Dev 2 ensures Reviewer dashboard is consistent |
| **H8** | Shared cleanup phase | **Both** | **Both** | Final cleanup must be coordinated — split files to avoid merge conflicts |

### File Ownership (Conflict Prevention)

**Dev 1 EXCLUSIVELY modifies:**
- `src/hooks/useApiQuery.ts` [NEW]
- `src/hooks/useApiMutation.ts` [NEW]
- `src/components/RoleGuard.tsx` [NEW]
- `src/components/skeletons/*` [NEW]
- `src/App.tsx`
- `src/pages/dashboard/RoleSelector.tsx`
- `src/pages/dashboard/Profile.tsx`
- `src/pages/dashboard/Messages.tsx`
- `src/pages/dashboard/Activity.tsx`
- `src/pages/dashboard/editor/Overview.tsx`
- `src/pages/dashboard/editor/Articles.tsx`
- `src/pages/dashboard/editor/Issues.tsx`
- `src/pages/dashboard/editor/Settings.tsx`

**Dev 1 NEVER touches:**
- `src/pages/dashboard/author/*`
- `src/pages/dashboard/reviewer/*`
- `src/pages/dashboard/layout/*`
- `src/utils/blindingFilter.ts`
- `src/store/useSubmissionStore.ts`
