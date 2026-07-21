import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import {
  getMessages,
  getRecipients,
  sendMessage,
  deleteMessage,
  starMessage,
  markAsRead
} from '../controllers/messageController';

const router = Router();

router.use(requireAuth);

router.get('/', getMessages);
router.get('/recipients', getRecipients);
router.post('/', sendMessage);
router.delete('/:id', deleteMessage);
router.patch('/:id/star', starMessage);
router.patch('/:id/read', markAsRead);

export default router;
