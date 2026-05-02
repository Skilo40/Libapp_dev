import { Router } from 'express';
import { createMessage, getMessages, replyMessage } from '../controllers/messageController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', createMessage);
router.get('/', protect, requireRole('admin'), getMessages);
router.patch('/:id/reply', protect, requireRole('admin'), replyMessage);

export default router;