# 🛠️ TASKS — DEV 2
## Authoring, Reviewing & Double-Blind Logic

> **Scope:** Author Dashboard, Reviewer Dashboard (double-blind), Layout Editor Dashboard  
> **Assigned To:** Dev 2  
> **Tracker Created:** July 20, 2026  
> **Source:** `DASHBOARD_INTEGRATION_PLAN.md` v1.0

---

## ⏳ Pre-Requisite: Wait for Dev 1 Infrastructure

> [!IMPORTANT]
> **DO NOT begin Phase 1 until Dev 1 has merged the following into `main`:**
> - `src/hooks/useApiQuery.ts` — Standardized data fetching hook
> - `src/hooks/useApiMutation.ts` — Standardized mutation hook with Sonner
> - `src/components/RoleGuard.tsx` — Role-scoped route protection
> - `src/components/skeletons/*` — Loading skeleton components
>
> **While waiting**, you can work on:
> - [ ] **0.1** Create `src/utils/blindingFilter.ts` — Reusable double-blind PII sanitization utility
>   - Define `BLINDED_FIELDS` constant array:
>     ```
>     authors, authorNames, author, author_id, author_name,
>     institutions, institution, emails, email,
>     orcid, orcid_id, affiliation, affiliations,
>     submission_authors, corresponding_author
>     ```
>   - Export `applyBlindingFilter<T>(data: T)` function that strips all listed fields
>   - Fully typed with generics — return type excludes blinded fields
> - [ ] **0.2** Review all Reviewer page source code — identify every location where author metadata could leak
> - [ ] **0.3** Review Author page source code — map all mock fallback patterns to be replaced

---

## Phase 1: Author Dashboard Integration (Day 2)

> The Author dashboard has the most user-facing complexity and touches the full submission lifecycle.

### Author Submissions Page

- [ ] **1.1** Integrate `src/pages/dashboard/author/Submissions.tsx`
  - Replace mock fallback array with `useApiQuery({ url: '/api/author/submissions' })`
  - Submissions scoped to `user.id` (backend responsibility)
  - Loading state: `<TableSkeleton rows={5} cols={4} />`
  - Error state: inline error banner with retry button
  - "New Submission" link → already functional (`<Link to="/dashboard/yazar/submit-wizard">`)
  - "→" track button per row → already functional (`<Link to="/dashboard/yazar/track/${sub.id}">`)

### Author Submit Wizard (3-Step Form)

- [ ] **1.2** Integrate `src/pages/dashboard/author/SubmitWizard.tsx`
  - **Step 1 — Metadata**: Already two-way bound via `useSubmissionStore.updateMetadata()`. No API call needed — cached in Zustand until final submit. ✅ No changes required
  - **Step 2 — Authors**: Add Author, Save Author, Delete Author, Cancel — all already functional via Zustand. ✅ No changes required
  - **Step 3 — File Upload**: File dropzone already working (`<input type="file" accept=".pdf">`). ✅ No changes required
  - [ ] **1.2a** Wire `handleComplete()` — Replace mock fallback submission:
    - Use `useApiMutation` with `POST /api/author/submit`
    - Send `multipart/form-data`: `{ file: PDF Blob, metadata: JSON string }`
    - Backend creates: `submissions` row + `submission_authors` rows + stores PDF in Supabase Storage
    - **Remove** the mock success fallback entirely
    - On failure: `toast.error('Submission failed: {message}')` — do NOT simulate success
  - [ ] **1.2b** Enforce dual-language validation gate (already implemented — verify it blocks):
    ```
    Required: titleEn, titleTr, abstractEn, abstractTr
    Missing any → toast.error('Please ensure all mandatory English and Turkish fields are filled.')
    ```

### Author Track Page (Manuscript Tracker)

- [ ] **1.3** Integrate `src/pages/dashboard/author/Track.tsx`
  - [ ] **1.3a** Fetch real submission status:
    - `useApiQuery({ url: '/api/author/submissions/:id' })` (read `:id` from URL params)
    - Response: `{ id, title, status, created_at, statusHistory[] }`
    - Derive `currentStep` from `status` field (replace hardcoded mock step)
    - Loading state: `<CardSkeleton count={1} />` or custom stepper skeleton
  - [ ] **1.3b** Wire "Withdraw Manuscript" button:
    - Use `useApiMutation` → `POST /api/author/withdraw/:id`
    - Remove mock fallback
    - On success: navigate to `/dashboard/yazar/submissions` + `toast.success('Manuscript withdrawn')`
    - On error: `toast.error('Withdrawal failed')`
  - [ ] **1.3c** Upgrade withdrawal confirmation dialog:
    - Replace `window.confirm()` with a styled custom `<dialog>` or modal
    - Modal content: explain consequences (reviewer tokens revoked, draft files archived)
    - Show `toast.loading('Processing withdrawal…')` after confirmation
  - [ ] **1.3d** Add "Upload Revised PDF" button (revision state):
    - Only visible when submission status is `REVISION_REQUIRED`
    - Add hidden `<input type="file" accept=".pdf">`
    - On file select: `POST /api/author/revisions/:id` with `multipart/form-data`
    - On success: refetch submission status + `toast.success('Revision uploaded')`
    - On error: `toast.error('Upload failed')`

### ✅ Phase 1 Testing Checkpoint

```
✅ Author sees ONLY their own submissions (scoped to user.id)
✅ Submit wizard creates a real submission in the database
✅ Dual-language validation blocks submission if TR/EN fields are empty
✅ Manuscript tracker shows correct pipeline position from real status
✅ Withdraw sets status to WITHDRAWN and navigates back
✅ Revised PDF upload works and updates status back to PENDING_PRE_CHECK
✅ Withdrawal confirmation uses styled modal (not window.confirm)
✅ Every button shows Sonner feedback (loading → success/error)
```

---

## Phase 2: Reviewer Dashboard Integration (Day 3)

> [!CAUTION]
> **Double-blind anonymization is the most critical academic integrity requirement.** Every line of code in this phase must be evaluated against the blinding rules. When in doubt, strip the data.

### Reviewer Assigned Page

- [ ] **2.1** Integrate `src/pages/dashboard/reviewer/Assigned.tsx`
  - Replace mock fallback with `useApiQuery({ url: '/api/reviewer/assigned' })`
  - Response: `[{ id, title, deadline, status }]` — **NO author metadata**
  - [ ] **2.1a** Verify API response contains ZERO author-identifying fields:
    - ❌ `author_id` — must NOT be present
    - ❌ `author_name` — must NOT be present
    - ❌ `email` — must NOT be present
    - ❌ `institution` — must NOT be present
    - ❌ `orcid` — must NOT be present
    - ❌ `submission_authors` — must NOT be joined
  - [ ] **2.1b** Apply `applyBlindingFilter()` as defense-in-depth on the response data
  - [ ] **2.1c** Wire deadline badge → render real `deadline` from `review_assignments` table
  - "Start Evaluation" button → already functional (`<Link to="/dashboard/reviewer/evaluate/${item.id}">`)
  - Loading state: `<CardSkeleton count={3} />`

### Reviewer Evaluate Page (PDF + Scoring)

- [ ] **2.2** Integrate `src/pages/dashboard/reviewer/Evaluate.tsx`
  - [ ] **2.2a** Wire PDF Viewer (left panel):
    - Fetch blinded PDF: `GET /api/reviewer/article/:id/pdf`
    - Render in `<iframe>` or `<embed>` or PDF.js viewer
    - File MUST be the **blinded version** from Supabase Storage
    - Replace fake skeleton placeholder with real PDF
  - [ ] **2.2b** Fetch article metadata (blinded):
    - `useApiQuery({ url: '/api/reviewer/article/:id', transform: applyBlindingFilter })`
    - Use `transform` option to apply `applyBlindingFilter` before state is set
    - Only allowed fields: `id`, `title`, `abstract`, `keywords`, `status`, `pdf_url`
  - [ ] **2.2c** Harden existing client-side sanitization:
    - Replace inline `delete sanitizedData.xxx` block (lines ~27-35) with `applyBlindingFilter()` call
    - This is SECONDARY defense — backend is primary enforcer
  - [ ] **2.2d** Score buttons (1-5 for Originality, Rigor) — already functional ✅
  - [ ] **2.2e** Textareas (Notes for Author, Confidential Comments for Editor) — already functional ✅
  - [ ] **2.2f** Final Recommendation dropdown (Accept/Revision/Reject) — already functional ✅
  - [ ] **2.2g** Wire "Save Draft" button:
    - Currently just navigates back (no draft persistence)
    - Use `useApiMutation` → `PUT /api/reviewer/evaluate/:id/draft`
    - Payload: `{ scores, notesForAuthor, confidentialNotes, recommendation }` (partial OK)
    - `toast.success('Draft saved')` — stay on page, do NOT navigate
  - [ ] **2.2h** Wire "Submit Review" button:
    - Remove mock fallback
    - Use `useApiMutation` → `POST /api/reviewer/evaluate/:id`
    - Payload: `{ scores: { originality, rigor }, notesForAuthor, confidentialNotes, recommendation }`
    - Validation gate: if any score is 0 or recommendation is empty → `toast.error('Please complete all scores and recommendation')`
    - On success: `toast.success('Review submitted')` + navigate to `/dashboard/reviewer/assigned`
    - On error: `toast.error('Submission failed')`

### Double-Blind End-to-End Verification

- [ ] **2.3** End-to-end double-blind audit:
  - [ ] **2.3a** Submit a test article as Author (with name, email, institution, ORCID filled)
  - [ ] **2.3b** Assign a reviewer to that article (Editor action — coordinate with Dev 1)
  - [ ] **2.3c** Log in as Reviewer → navigate to Assigned → verify ZERO author info visible
  - [ ] **2.3d** Open Evaluate page → inspect network response → confirm no PII in JSON
  - [ ] **2.3e** View PDF → confirm it's the blinded version (no author names in header/footer)
  - [ ] **2.3f** Check browser DevTools console → no author data logged

### ✅ Phase 2 Testing Checkpoint

```
✅ Reviewer sees ONLY manuscripts assigned to them
✅ NO author name, email, institution, or ORCID visible anywhere in UI
✅ NO author metadata in API response (verified in DevTools Network tab)
✅ PDF preview loads the blinded version
✅ blindingFilter utility applied as defense-in-depth on all reviewer data
✅ Review submission creates a real review record in database
✅ Save Draft persists partial review without navigating away
✅ Validation blocks submission if scores/recommendation incomplete
✅ Sonner feedback on all interactive elements
```

---

## Phase 3: Layout Editor Dashboard Integration (Day 4)

### Layout Queue Page

- [ ] **3.1** Integrate `src/pages/dashboard/layout/Queue.tsx`
  - Replace mock fallback with `useApiQuery({ url: '/api/layout/queue' })`
  - Response: `[{ id, title, priority, date }]` — submissions with `status = 'IN_COPYEDITING'`
  - Scoped to active tenant (`journal_id`)
  - Loading state: `<TableSkeleton rows={5} cols={4} />`
  - [ ] **3.1a** Fix "Process →" button routing:
    - Current: all rows link to same `/dashboard/layout/proofs` (no article ID)
    - Fix: `<Link to="/dashboard/layout/proofs/${item.id}">` or `?articleId=${item.id}`
    - Choose URL param pattern consistent with Track page (`/proofs/:id`)

### Layout Proofs Page

- [ ] **3.2** Integrate `src/pages/dashboard/layout/Proofs.tsx`
  - [ ] **3.2a** Dynamic article loading:
    - Read `articleId` from URL params (`useParams()` or `useSearchParams()`)
    - Fetch metadata: `useApiQuery({ url: '/api/layout/article/:id' })`
    - Replace hardcoded `JMS-2025-015` with real article title, author, ID
  - [ ] **3.2b** Wire "Download Raw Source" button:
    - `GET /api/layout/article/:id/source` → download original PDF
    - Use `window.open(url)` or create a temporary `<a download>` link
    - `toast.success('Download started')` on click
  - [ ] **3.2c** File upload dropzone — already working ✅ (hidden `<input type="file" accept=".pdf">`)
  - [ ] **3.2d** Wire "Preview Upload" button:
    - Currently non-functional
    - On click: `URL.createObjectURL(selectedFile)` → `window.open()` in new tab
    - Only enabled when `selectedFile` is set
  - [ ] **3.2e** Wire "Mark as READY_FOR_PRODUCTION" button:
    - Remove mock fallback
    - Use `useApiMutation` → `POST /api/layout/upload-proof`
    - Send `multipart/form-data: { file: PDF, articleId: uuid }`
    - Backend updates submission status to `READY_FOR_PRODUCTION`
    - On success: `toast.success('Proof uploaded — article marked as READY_FOR_PRODUCTION')` + navigate to queue
    - On error: `toast.error('Upload failed')`

### ✅ Phase 3 Testing Checkpoint

```
✅ Queue shows only IN_COPYEDITING submissions for the active tenant
✅ "Process" button navigates to the correct article's proof page (with article ID)
✅ Proof page loads real article metadata dynamically from URL params
✅ "Download Raw Source" downloads the author's original PDF
✅ "Preview Upload" opens selected PDF in new tab (client-side)
✅ "Mark as READY_FOR_PRODUCTION" uploads proof and updates status via real API
✅ No mock fallback data remains
✅ Sonner feedback on all interactive elements
```

---

## Phase 4: Cleanup & Hardening (Shared with Dev 1)

- [ ] **4.1** Remove ALL mock fallback arrays from pages you own (Author, Reviewer, Layout)
- [ ] **4.2** Remove any `(Local Mock)` or `(Local MOCK)` toast suffixes in your pages
- [ ] **4.3** Remove `console.warn('Backend unavailable...')` fallback patterns in your pages
- [ ] **4.4** Run full TypeScript build: `npm run build` — zero errors in your files
- [ ] **4.5** Audit `any` types in files you own — replace with proper interfaces
- [ ] **4.6** Double-blind final audit:
  - Search entire frontend codebase for any renderer that could expose author identity to reviewers
  - Grep for: `author_name`, `authorName`, `institution`, `email` in reviewer components
  - Verify `blindingFilter.ts` covers all PII fields
- [ ] **4.7** Cross-role test: log in as Author → attempt Reviewer routes → verify redirect by `RoleGuard`

---

## 🤝 Handshake Points

These are coordination points where Dev 1 and Dev 2 must sync to avoid blocking or conflicts.

| # | What | Who Produces | Who Consumes | Sync Trigger |
|---|------|-------------|-------------|-------------|
| **H1** | `useApiQuery` hook | Dev 1 | **Dev 2** | ⚠️ **BLOCKER** — Dev 2 cannot start Phase 1 until this is merged to `main` |
| **H2** | `useApiMutation` hook | Dev 1 | **Dev 2** | ⚠️ **BLOCKER** — Dev 2 needs this for Submit Wizard, Review Submit, Proof Upload |
| **H3** | `RoleGuard` component | Dev 1 | **Dev 2** | ⚠️ **BLOCKER** — Dev 2 needs this to wrap Author/Reviewer/Layout routes in `App.tsx` (but Dev 1 owns `App.tsx`) |
| **H4** | Skeleton components | Dev 1 | **Dev 2** | ⚠️ **BLOCKER** — Dev 2 needs `TableSkeleton`, `CardSkeleton` for loading states |
| **H5** | `blindingFilter.ts` utility | **Dev 2** | Dev 1 | Dev 1 may import this for Messages page double-blind masking |
| **H6** | `App.tsx` route updates | Dev 1 | **Dev 2** | Dev 1 owns `App.tsx`. **Dev 2 must NOT modify `App.tsx`.** If you need route changes (e.g., `/proofs/:id` param), communicate to Dev 1 and they will add it |
| **H7** | Assign Reviewer action | Dev 1 (Editor Articles) | **Dev 2** (Reviewer Assigned) | Dev 1's "Assign Reviewer" action creates `review_assignments` rows. Dev 2's Reviewer dashboard reads them. Coordinate on field naming |
| **H8** | Shared cleanup phase | **Both** | **Both** | Final cleanup must be coordinated — each dev cleans only their own files |

### File Ownership (Conflict Prevention)

**Dev 2 EXCLUSIVELY modifies:**
- `src/utils/blindingFilter.ts` [NEW]
- `src/pages/dashboard/author/Submissions.tsx`
- `src/pages/dashboard/author/SubmitWizard.tsx`
- `src/pages/dashboard/author/Track.tsx`
- `src/pages/dashboard/reviewer/Assigned.tsx`
- `src/pages/dashboard/reviewer/Evaluate.tsx`
- `src/pages/dashboard/layout/Queue.tsx`
- `src/pages/dashboard/layout/Proofs.tsx`
- `src/store/useSubmissionStore.ts` (if changes needed for wizard)

**Dev 2 NEVER touches:**
- `src/App.tsx`
- `src/hooks/useApiQuery.ts`
- `src/hooks/useApiMutation.ts`
- `src/components/RoleGuard.tsx`
- `src/components/skeletons/*`
- `src/pages/dashboard/editor/*`
- `src/pages/dashboard/RoleSelector.tsx`
- `src/pages/dashboard/Profile.tsx`
- `src/pages/dashboard/Messages.tsx`
- `src/pages/dashboard/Activity.tsx`
- `src/services/api/client.ts`
