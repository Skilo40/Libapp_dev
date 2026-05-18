import { Router } from 'express';
import { getBooks, getBook, createBook, updateBook, deleteBook, deleteAllBooks } from '../controllers/bookController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);
router.delete('/all', requireRole('admin'), deleteAllBooks);

export default router;