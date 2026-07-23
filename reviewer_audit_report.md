# Reviewer Workflow Audit Report

This report outlines the findings from a comprehensive audit of the Reviewer (Hakem) lifecycle and workflow within the codebase. The audit focused on data flow, security (double-blind integrity), access control, UI/UX, and component state.

## 🔴 Critical Logic/Security Flaws

1. **Double-Blind Integrity Leak (Original PDF Access)**
   - **File:** `src/controllers/reviewerController.ts`
   - **Why it's a problem:** The `getPdfForReview` endpoint generates a signed URL or streams the manuscript from `manuscripts/${id}/manuscript.pdf`. If this represents the original file uploaded by the author, it likely contains the author's name, affiliation, and contact details on the title page. There is no automated blinding process or separate `blinded_manuscript.pdf` being enforced, which entirely breaks the double-blind review process.

2. **Double-Blind Integrity Leak (Metadata)**
   - **File:** `src/controllers/reviewerController.ts`
   - **Why it's a problem:** In `getAssignedReviews` and `getArticleForReview`, the interceptor correctly deletes the `submission_authors` relation. However, in `getAssignedReviews`, it fails to scrub the `author_id` field from the root `submissions` table. A tech-savvy reviewer could potentially inspect the network payload and cross-reference this `author_id` to identify the author.

3. **Controller Function Overwrite / API Mismatch (Crash on Submit)**
   - **Files:** `src/controllers/reviewerController.ts` & `src/pages/dashboard/reviewer/Evaluate.tsx`
   - **Why it's a problem:** There is a catastrophic duplicate export in `reviewerController.ts`. `evaluateArticle` is defined twice (once at lines 96-161, and again at lines 405-460). The latter definition overwrites the former. The latter definition *only* checks for `{ content }` in `req.body`, completely ignoring structured payloads. 
   Meanwhile, `Evaluate.tsx` sends a structured JSON payload (`{ scores, notesForAuthor, ... }`) without wrapping it in a `content` key. This will cause submissions to fail 100% of the time with a `400 Bad Request: Review content is required` error.

4. **Missing Backend Role-Based Authorization**
   - **File:** `src/routes/reviewerRoutes.ts`
   - **Why it's a problem:** The routes are protected by `requireAuth` but lack a strict role guard (e.g., `requireRole(['reviewer'])`). While SQL queries are correctly scoped to `userId` preventing unauthorized data access to specific manuscripts, technically any authenticated user (e.g., an author) could hit these endpoints. A strict middleware should reject the request outright if the token lacks the `reviewer` role.

## 🟡 UI/UX & Feedback Flaws

1. **Poor Mobile Layout Strategy for Document Reference**
   - **File:** `src/pages/dashboard/reviewer/Evaluate.tsx`
   - **Why it's a problem:** The layout uses `flex-col lg:flex-row`. On mobile screens, the PDF viewer is stacked above the scoring form. Since the PDF viewer takes significant vertical space, the user will have to scroll down to fill out the form, completely losing sight of the PDF. They will have to constantly scroll up and down. A tabbed interface (PDF vs. Form) or a floating action sheet would be significantly better for mobile UX.

2. **Missing Form "Dirty" State Validation**
   - **File:** `src/pages/dashboard/reviewer/Evaluate.tsx`
   - **Why it's a problem:** The "Save Draft" button disables correctly when loading, but it does not track if the form is actually "dirty" (has unsaved changes). Reviewers can repeatedly click "Save Draft" even if no fields have changed, causing unnecessary API spam.

3. **Inconsistent Error Localization**
   - **File:** `src/pages/dashboard/reviewer/Evaluate.tsx`
   - **Why it's a problem:** In `submitReviewMutate`, the `onError` toast displays the error message directly from the backend (`Submission failed: ${message}`). The `locale` state (Turkish vs. English) is completely ignored for this specific toast, leading to a jarring user experience where a Turkish user receives an English API error.

## 🟢 Code Health & Cleanup

1. **Massive Code Duplication in Controller**
   - **File:** `src/controllers/reviewerController.ts`
   - **Why it's a problem:** Lines 314-525 are practically a direct copy-paste of lines 5-161. Functions like `getAssignedReviews`, `getArticleForReview`, and `evaluateArticle` are duplicated. This bloats the file, causes the critical overwrite bug mentioned above, and makes future maintenance a nightmare.

2. **Duplicate Imports in Routes**
   - **File:** `src/routes/reviewerRoutes.ts`
   - **Why it's a problem:** The controller functions are imported twice at the top of the file. While TypeScript/JavaScript might ignore the redundant import silently, it represents sloppy code structure and can lead to developer confusion.
