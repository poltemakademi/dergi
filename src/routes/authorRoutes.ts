import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import {
  getAuthorSubmissions,
  submitManuscript,
  getSubmissionById,
  withdrawSubmission,
  uploadRevision
} from '../controllers/authorController';

const router = Router();

// Secure all author routes
router.use(requireAuth);

// GET /api/author/submissions — list all author's submissions
router.get('/submissions', getAuthorSubmissions);

// GET /api/author/submissions/:id — get single submission with status history (used by Track.tsx)
router.get('/submissions/:id', getSubmissionById);

// POST /api/author/submit — submit a new manuscript
router.post('/submit', submitManuscript);

// POST /api/author/withdraw/:id — withdraw a submission (used by Track.tsx)
router.post('/withdraw/:id', withdrawSubmission);

// POST /api/author/revisions/:id — upload a revised PDF (used by Track.tsx)
router.post('/revisions/:id', uploadRevision);

export default router;
