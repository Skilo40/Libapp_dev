import { Router } from 'express';
import { getNotifications, markRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/:memberId', protect, getNotifications);
router.patch('/:memberId/read', protect, markRead);

export default router;