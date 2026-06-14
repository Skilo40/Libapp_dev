import { Router } from 'express';
import { getProfile, updateProfile, getLoanHistory } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/:id', protect, getProfile);
router.patch('/:id', protect, upload.single('avatar'), updateProfile);
router.get('/:id/loans', protect, getLoanHistory);

export default router;