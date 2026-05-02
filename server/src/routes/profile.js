import { Router } from 'express';
import { getProfile, updateProfile, getLoanHistory } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/:id', protect, getProfile);
router.patch('/:id', protect, updateProfile);
router.get('/:id/loans', protect, getLoanHistory);

export default router;