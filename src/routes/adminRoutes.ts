import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { 
  getSystemStats, 
  getJournals, 
  createJournal, 
  updateJournal, 
  deleteJournal, 
  getUsers, 
  updateUserRole, 
  updateUserStatus 
} from '../controllers/adminController';

const router = Router();

// Secure all admin routes
router.use(requireAuth);

// System Overview & Stats
router.get('/system/stats', getSystemStats);

// Admin Journals Management
router.get('/journals', getJournals);
router.post('/journals', createJournal);
router.put('/journals/:id', updateJournal);
router.delete('/journals/:id', deleteJournal);

// Admin Users & Roles Management
router.get('/users', getUsers);
router.put('/users/:id/roles', updateUserRole);
router.put('/users/:id/status', updateUserStatus);

export default router;
