import { Router } from 'express';
import { getBooks, getBook, createReview, getGenres } from '../controllers/catalogController.js';

const router = Router();

router.get('/', getBooks);
router.get('/filters', getGenres);
router.get('/:id', getBook);
router.post('/:id/reviews', createReview);

export default router;