import { Router } from 'express';
import { getMembers, getMember, createMember, updateMember, deleteMember } from '../controllers/memberController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/', getMembers);
router.get('/:id', getMember);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;