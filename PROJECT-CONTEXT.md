# Project Context: Academic Journal SaaS Platform Frontend (Vite Edition)

## 1. Project Vision & Architecture Scope
This is the standalone frontend repository for an enterprise-grade multi-tenant Academic Journal Management SaaS platform[cite: 6]. The application is built using a Client-Side Rendering (CSR) approach but designed to handle complex multi-tenant routing contexts and strict academic data blinding protocols[cite: 6]. 

* **Platform Nature:** Multi-tenant infrastructure hosting hundreds of independent journals dynamically[cite: 6].
* **Core Tech Stack:** Vite, React, TypeScript, Tailwind CSS, Shadcn UI, Zustand (for mock global states and tenant/role switching mechanics).
* **Note on Backend/Database:** Excluded from current scope. The frontend must implement full dynamic client-side simulation layers (mock stores) until backend contracts are integrated.

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
* `/` : Unified search deck to query across all hosted journals by DOI, Author, or Title keywords[cite: 6].
* `/early-access` : Public timeline indexing articles published in press (minted DOIs without issue binding)[cite: 6].
* `/sistem-ozellikleri` : High-conversion SaaS overview page displaying system dashboard features[cite: 6].
* `/entegrasyonlar` : Structural pages details integrations like Sobiad indexing, Crossref DOI, Turnitin, and mass email gateways[cite: 6].
* `/basvurular` : Dynamic multi-step enrollment form layouts for new journal applications and DOI packages[cite: 6].

### 🛠️ Secured Dashboard Spaces (`/dashboard/*`)

#### 1. Executive Editor Core (`/dashboard/editor`)
* `Journal Settings` : Interface managing specific journal metadata (ISSN, double-language headers, logos, and locale parameter boundaries)[cite: 6].
* `Issue Studio` : Visual kanban interface creating issues, uploading generic templates (Jenerik), sorting article indexing pagination, and generating Table of Contents lists[cite: 6].
* `CMS Editor Block` : Minimal text/block compiler letting editors construct isolated static info sections[cite: 6].
* `Analytics Metrics` : Interactive graphical reporting visualizing data loads, item updates, and PDF file downloads[cite: 6].

#### 2. Layout Editor Workspace (`/dashboard/layout`)
* `Production Line` : Monitoring terminal pulling files currently stuck in `IN_COPYEDITING` status[cite: 6].
* `Proof Manager` : Layout uploading typeset Galley Proof assets (final PDFs) and closing version tracking logs[cite: 6].

#### 3. Peer Review Studio (`/dashboard/reviewer`)
* `Evaluation Deck` : Anonymized layout rendering a secure document preview module side-by-side with score evaluation textareas[cite: 6].

#### 4. Researcher Panel (`/dashboard/yazar`)
* `Submission Wizard` : Multi-step wizard capturing double-language string text metrics, co-author lists, and blinded initial file uploads[cite: 6].
* `Manuscript Tracker` : Visual workflow timeline monitoring live statuses, revision requirements, and final acceptance results[cite: 6].

#### 5. Safe Mail Hub (`/dashboard/messages`)
* Isolated, multi-role internal messaging component encrypting communication lines between Author, Editor, and Reviewer entities to enforce blinding rules[cite: 6].

## 4. Engineering Development Rules for the AI Agent
* **Role Simulation Controller:** You must implement and persist a fixed floating bar layout on the screen in development mode to simulate role switches dynamically (`super_admin`, `editor`, `layout_editor`, `reviewer`, `author`)[cite: 6].
* **Strict Interface Safety:** Enforce explicit TypeScript type bindings for all entity models and UI prop objects. Avoid passing raw `any` declarations under any conditions.
* **Layout Integrity:** Build responsive Tailwind blocks maximizing information space for heavy tracking data, parallel input blocks, and custom canvas grids.