import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import {
  getProductionQueue,
  getArticleForLayout,
  downloadSource,
  uploadProof,
} from '../controllers/layoutController';

const router = Router();

// Secure all layout editor routes
router.use(requireAuth);

// GET /api/layout/queue — list of accepted articles ready for typesetting
router.get('/queue', getProductionQueue);

// GET /api/layout/article/:id — article metadata for the proofs page
router.get('/article/:id', getArticleForLayout);

// GET /api/layout/article/:id/source — download the raw manuscript source PDF
router.get('/article/:id/source', downloadSource);

// POST /api/layout/upload-proof — upload formatted galley proof + mark READY_FOR_PRODUCTION
router.post('/upload-proof', uploadProof);

export default router;
