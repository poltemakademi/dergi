import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import {
  getEditorArticles,
  updateArticleStatus,
  assignReviewer,
  getReviewers
} from '../controllers/editorController';
// We will import issue controller here too for phase 5
import { createIssue } from '../controllers/issueController';

const router = Router();

// Secure all editor routes
router.use(requireAuth);

// Phase 3 routes
router.get('/articles', getEditorArticles);
router.patch('/articles/:id/status', updateArticleStatus);
router.post('/articles/:id/assign-reviewer', assignReviewer);

// GET /api/editor/reviewers — list all reviewers for the assign-reviewer dropdown
router.get('/reviewers', getReviewers);

// Phase 5 routes (Issue Publishing)
router.post('/issues/create', createIssue);

export default router;

