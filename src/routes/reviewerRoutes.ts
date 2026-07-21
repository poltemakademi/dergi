import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { getAssignedReviews, getArticleForReview, evaluateArticle, getInvitations, getReviewHistory } from '../controllers/reviewerController';

const router = Router();

// Secure all reviewer routes
router.use(requireAuth);

// GET /api/reviewer/invitations
router.get('/invitations', getInvitations);

// GET /api/reviewer/assigned
router.get('/assigned', getAssignedReviews);

// GET /api/reviewer/history
router.get('/history', getReviewHistory);

// GET /api/reviewer/article/:id (THE BLINDING INTERCEPTOR)
router.get('/article/:id', getArticleForReview);

// POST /api/reviewer/evaluate/:id
router.post('/evaluate/:id', evaluateArticle);

export default router;
