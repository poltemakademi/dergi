import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { getAuthorSubmissions, submitManuscript } from '../controllers/authorController';

const router = Router();

// Secure all author routes
router.use(requireAuth);

// GET /api/author/submissions
router.get('/submissions', getAuthorSubmissions);

// POST /api/author/submit
router.post('/submit', submitManuscript);

export default router;
