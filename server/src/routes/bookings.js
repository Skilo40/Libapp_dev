import { Router } from 'express';
import { createBooking, getBookings, updateBooking, getMemberBookings } from '../controllers/bookingController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', createBooking);
router.get('/', protect, requireRole('admin'), getBookings);
router.patch('/:id', protect, requireRole('admin'), updateBooking);
router.get('/member/:memberId', protect, getMemberBookings);

export default router;