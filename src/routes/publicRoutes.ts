import { Router } from 'express';
import { getPublishedContent } from '../controllers/publicController';

const router = Router();

// Public directory route for journals, articles, issues
router.get('/directory', getPublishedContent);

export default router;
