import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { getJournals, createJournal, getUsers } from '../controllers/adminController';

const router = Router();

// Secure all admin routes
router.use(requireAuth);

// Admin Journals
router.get('/journals', getJournals);
router.post('/journals', createJournal);

// Admin Users
router.get('/users', getUsers);

export default router;
