import { Router } from 'express';
import { getLoans, getLoan, createLoan, returnLoan } from '../controllers/loanController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/', getLoans);
router.get('/:id', getLoan);
router.post('/', createLoan);
router.patch('/:id/return', returnLoan);

export default router;