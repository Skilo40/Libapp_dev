import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/register', protect, requireRole('admin'), register);

export default router;