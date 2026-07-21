import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { getNotifications } from '../controllers/notificationController';

const router = Router();

router.use(requireAuth);

router.get('/', getNotifications);

export default router;
