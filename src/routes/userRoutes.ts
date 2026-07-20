import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { getUserProfile, updateUserProfile, getUserWorkspaces } from '../controllers/userController';

const router = Router();

// Secure all user routes
router.use(requireAuth);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/workspaces', getUserWorkspaces);

export default router;
