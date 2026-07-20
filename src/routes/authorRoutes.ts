import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { getAuthorSubmissions, submitManuscript, getSubmissionById } from '../controllers/authorController';

const router = Router();

// Secure all author routes
router.use(requireAuth);

// GET /api/author/submissions
router.get('/submissions', getAuthorSubmissions);

// GET /api/author/submissions/:id
router.get('/submissions/:id', getSubmissionById);

// POST /api/author/submit
router.post('/submit', submitManuscript);

export default router;
