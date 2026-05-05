import express from 'express';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();

router.get('/member/:memberId', notificationController.getNotifications);
router.put('/member/:memberId/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

export default router;