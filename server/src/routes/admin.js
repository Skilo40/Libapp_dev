import { Router } from 'express';
import {
  updateLoanDates,
  updateStock,
  addStockLot,
  getAuditLogs,
  getStats,
} from '../controllers/adminController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(protect, requireRole('admin'));

router.get('/stats', getStats);
router.patch('/loans/:id', updateLoanDates);
router.patch('/books/:id/stock', updateStock);
router.post('/stock/lot', addStockLot);
router.get('/audit', getAuditLogs);

export default router;