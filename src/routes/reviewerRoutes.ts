import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { getAssignedReviews, getArticleForReview, evaluateArticle, getInvitations, getReviewHistory } from '../controllers/reviewerController';
import {
  getAssignedReviews,
  getArticleForReview,
  evaluateArticle,
  getPdfForReview,
  saveDraftEvaluation
} from '../controllers/reviewerController';

const router = Router();

// Secure all reviewer routes
router.use(requireAuth);

// GET /api/reviewer/invitations
router.get('/invitations', getInvitations);

// GET /api/reviewer/assigned
router.get('/assigned', getAssignedReviews);

// GET /api/reviewer/history
router.get('/history', getReviewHistory);

// GET /api/reviewer/article/:id (THE BLINDING INTERCEPTOR — metadata only)
router.get('/article/:id', getArticleForReview);

// GET /api/reviewer/article/:id/pdf (Secure PDF blob stream for Evaluate.tsx)
router.get('/article/:id/pdf', getPdfForReview);

// POST /api/reviewer/evaluate/:id
router.post('/evaluate/:id', evaluateArticle);

// PUT /api/reviewer/evaluate/:id/draft (Save draft evaluation — used by Evaluate.tsx)
router.put('/evaluate/:id/draft', saveDraftEvaluation);

export default router;

