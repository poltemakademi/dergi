# Project Context: Academic Journal SaaS Platform Frontend (Vite Edition)

## 1. Project Vision & Architecture Scope
This is the standalone frontend repository for an enterprise-grade multi-tenant Academic Journal Management SaaS platform[cite: 6]. The application is built using a Client-Side Rendering (CSR) approach but designed to handle complex multi-tenant routing contexts and strict academic data blinding protocols[cite: 6]. 

* **Platform Nature:** Multi-tenant infrastructure hosting hundreds of independent journals dynamically[cite: 6].
* **Core Tech Stack:** Vite, React, TypeScript, Tailwind CSS, Shadcn UI, Zustand (for mock global states and tenant/role switching mechanics).
* **Note on Backend/Database:** The project is now connected to a LIVE real backend (Node.js/Express API) and a real database. The frontend must make actual HTTP requests to the provided API endpoints using an API client (like Axios). Zustand should only be used for UI state and Auth persistence, NOT for mocking data.

## 2. Dynamic State Machine & Rules
The frontend must strictly track, visualize, and enforce the following sequential submission pipeline states[cite: 6]:
* `PENDING_PRE_CHECK`: Preliminary screening validation phase[cite: 6].
* `IN_REVIEW`: Active anonymous peer evaluation phase[cite: 6].
* `REVISION_REQUIRED`: Sent back to author for necessary structural updates[cite: 6].
* `ACCEPTED`: Passed academic validation and pushed to production queue[cite: 6].
* `IN_COPYEDITING`: Current typesetting and language check phase[cite: 6].
* `READY_FOR_PRODUCTION`: Formatted galley proof ready for release[cite: 6].
* `PUBLISHED`: Released in a regular issue or early access timeline[cite: 6].
* `WITHDRAWN`: Voluntarily retracted by the submitting author[cite: 6].

### Critical Frontend Constraints:
1. **Dual-Language Metadata Validation:** The step-1 creation wizard must prevent submission progress if fields like `Title`, `Abstract` (Özet), and `Keywords` are not provided in both mandatory languages (Turkish and English)[cite: 6].
2. **Double-Blind Anonymity Shield:** When the active mock role is set to `reviewer`, the UI components must fully intercept and strip any exposure of author names, emails, or institutional affiliations from the manuscript metadata or document layout[cite: 6].
3. **Manuscript Withdrawal Interaction:** Provide an absolute emergency withdrawal modal that shifts states to `WITHDRAWN`, visualizing the destruction of assigned reviewer tokens and draft files[cite: 6].

## 3. Client-Side Routing Configuration (Vite + React Router)

### 🌐 Public Marketing & Indexing Routes (No Auth)

#### `/` (Platform Homepage)
* **UI/UX:** Features the fullscreen split Hero Section, dynamic 3D Journal Slider, and the infinite scrolling Marquee of hosted journals. Includes a global search bar.
* **Backend/Logic:** Triggers a `GET /api/global/search` to query articles and journals across all tenants. Uses Zustand to manage the slider state.

#### `/sistem-ozellikleri` (System Features)
* **UI/UX:** High-conversion SaaS landing page displaying AI workflow automation and dashboard capabilities using responsive glassmorphic cards.
* **Backend/Logic:** Completely static CSR route.

#### `/entegrasyonlar` (Integrations)
* **UI/UX:** Grid layout showcasing partner logos (Crossref, Turnitin, Sobiad, DOAJ) with detailed technical explanations.
* **Backend/Logic:** Static content rendering.

#### `/early-access` (Articles in Press)
* **UI/UX:** A timeline list or grid of articles that are accepted and have a minted DOI but are not yet assigned to a specific issue.
* **Backend/Logic:** `GET /api/global/early-access`. Fetches articles with status: `PUBLISHED` but `issue_id: null`.

#### `/basvurular/dergi` (Journal Application Form)
* **UI/UX:** A multi-step, validated form capturing editor details, ISSN, and institutional affiliation.
* **Backend/Logic:** Validates fields via Zod/Yup, then triggers `POST /api/applications/journal`.

#### `/basvurular/doi` (DOI Package Application)
* **UI/UX:** Financial and technical form to request Crossref DOI integration packages.
* **Backend/Logic:** `POST /api/applications/doi`.

### 🏛️ Individual Tenant Gateway (Public Journal Pages)
**Domain:** `/:tenant_slug` (e.g., smac.dergiplatformu.com)
This dynamic route serves the specific content of a single hosted journal.

#### `/:tenant_slug/` (Journal Homepage)
* **UI/UX:** Displays the specific journal's cover, ISSN, Aim & Scope widget, and a grid of "Featured Articles".
* **Backend/Logic:** On mount, `GET /api/tenant/:slug/metadata` to load the brand colors, logo, and active issue.

#### `/:tenant_slug/current` (Current Issue)
* **UI/UX:** Lists all articles in the latest published issue, separated by categories (e.g., Research Articles, Review Articles).
* **Backend/Logic:** `GET /api/tenant/:slug/issues/latest`.

#### `/:tenant_slug/archives` (Issue Archives)
* **UI/UX:** An accordion or tree-view layout grouping past issues by Year and Volume.
* **Backend/Logic:** `GET /api/tenant/:slug/issues/archive`.

#### `/:tenant_slug/article/:id` (Article Detail Page)
* **UI/UX:** Displays dual-language Abstract, Keywords, Author list, DOI link, and a prominent "Download PDF" button.
* **Backend/Logic:** `GET /api/tenant/:slug/articles/:id`. Clicking download triggers `POST /api/metrics/download/:id` to increment the analytics counter before fetching the PDF blob.

#### `/:tenant_slug/policies` & `/:tenant_slug/board` (CMS Pages)
* **UI/UX:** Rich text pages displaying editorial boards and ethical guidelines (Double-blind policy, Open Access).
* **Backend/Logic:** Fetched dynamically via `GET /api/tenant/:slug/pages/:page_alias`.

### 🔐 Authentication & Onboarding Route: `/auth/*`

#### `/auth/login` (Unified Login)
* **UI/UX:** Minimalist, centered glassmorphic login card.
* **Backend/Logic:** `POST /api/auth/login`. Returns a JWT and an array of RBAC (Role-Based Access Control) claims. Zustand `useAuthStore` saves the token and user roles.

#### `/auth/register` (Academic Registration)
* **UI/UX:** Registration form requesting Name, Institutional Email, University, and ORCID ID (with strict format masking: XXXX-XXXX-XXXX-XXXX).
* **Backend/Logic:** `POST /api/auth/register`. Requires email verification logic setup.

### 🛠️ Secured Role-Based Dashboards Route: `/dashboard/*`
Protected routes that require a valid JWT. Includes a persistent floating UI bar in dev mode to switch roles (Super Admin, Editor, Reviewer, Author).

#### 4.1 Shared Spaces (All Roles)

**`/dashboard/role-selector`**
* **UI/UX:** If a user has multiple roles (e.g., Editor in Journal A, Author in Journal B), they select their active workspace here.
* **Backend/Logic:** Updates the `activeRole` and `activeTenant` in Zustand.

**`/dashboard/profile`**
* **UI/UX:** Form to update academic titles, IBAN for payments, and contact info.
* **Backend/Logic:** `PUT /api/user/profile`.

**`/dashboard/messages` (Safe Mail Hub)**
* **UI/UX:** An isolated inbox for system notifications and encrypted cross-role communication.
* **Backend/Logic:** Messages are fetched via `GET /api/messages`. The backend masks sender identities based on the active role (e.g., displaying "Reviewer 1" instead of the real name).

#### 4.2 Executive Editor (`/dashboard/editor`)

**`/dashboard/editor/overview` (Analytics)**
* **UI/UX:** Charts (Recharts/Chart.js) showing submission trends, acceptance rates, and PDF downloads.
* **Backend/Logic:** `GET /api/editor/analytics`.

**`/dashboard/editor/articles` (Manuscript Pool)**
* **UI/UX:** A data table with tabs filtering articles by status (PENDING_PRE_CHECK, IN_REVIEW, ACCEPTED, PUBLISHED).
* **Backend/Logic:** `GET /api/editor/articles?status=...`.

**`/dashboard/editor/issues` (Issue Studio)**
* **UI/UX:** Kanban board to drag-and-drop accepted articles into a new issue. Dropzones for uploading Generic info ("Jenerik") and TOC files.
* **Backend/Logic:** `POST /api/editor/issues/create` using multipart/form-data.

**`/dashboard/editor/settings` (Journal Settings)**
* **UI/UX:** Configuration form for ISSN, DOAJ API keys, and drag-and-drop zones for Logos and Covers.
* **Backend/Logic:** `PUT /api/journal/settings`.

#### 4.3 Author/Researcher (`/dashboard/yazar`)

**`/dashboard/yazar/submissions` (My Articles)**
* **UI/UX:** Grid of cards showing the current status of the author's submitted manuscripts.
* **Backend/Logic:** `GET /api/author/submissions`.

**`/dashboard/yazar/submit-wizard` (Submission Engine)**
* **UI/UX:** A multi-step wizard. Step 1: Dual-language metadata. Step 2: Co-authors. Step 3: Blinded PDF Upload.
* **Backend/Logic:** Uses Zustand to cache steps locally. On completion, `POST /api/author/submit` (multipart).

**`/dashboard/yazar/track/:id` (Manuscript Tracker)**
* **UI/UX:** A visual stepper tracking the pipeline. Includes a "Withdraw" emergency button.
* **Backend/Logic:** Listens for status changes. Withdrawal triggers `POST /api/author/withdraw/:id`.

#### 4.4 Peer Reviewer (`/dashboard/reviewer`)

**`/dashboard/reviewer/assigned` (Queue)**
* **UI/UX:** List of manuscripts awaiting evaluation.

**`/dashboard/reviewer/evaluate/:id` (Evaluation Deck)**
* **UI/UX:** Side-by-side layout. Left: PDF preview. Right: Scoring form and textareas for revision notes.
* **Backend/Logic:** **CRITICAL:** Frontend interceptor runs here. The `GET /api/reviewer/article/:id` request is stripped of any author metadata in the Zustand store before rendering to guarantee the Double-Blind shield. Form submission triggers `POST /api/reviewer/evaluate/:id`.

#### 4.5 Layout Editor (`/dashboard/layout`)

**`/dashboard/layout/queue` (Production Line)**
* **UI/UX:** List of articles in `IN_COPYEDITING`.

**`/dashboard/layout/proofs` (Proof Manager)**
* **UI/UX:** Interface to upload the final, typeset Galley Proof (PDF) that will be visible to the public.
* **Backend/Logic:** `POST /api/layout/upload-proof` updates the state to `READY_FOR_PRODUCTION`.

## 4. Engineering Development Rules for the AI Agent
* **Role Simulation Controller:** You must implement and persist a fixed floating bar layout on the screen in development mode to simulate role switches dynamically (`super_admin`, `editor`, `layout_editor`, `reviewer`, `author`)[cite: 6].
* **Strict Interface Safety:** Enforce explicit TypeScript type bindings for all entity models and UI prop objects. Avoid passing raw `any` declarations under any conditions.
* **Layout Integrity:** Build responsive Tailwind blocks maximizing information space for heavy tracking data, parallel input blocks, and custom canvas grids.