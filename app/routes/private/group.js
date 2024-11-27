import { Router } from 'express';
import { showNewSplitBillForm, createGroups, getGroup, deleteGroup } from '../../controller/groupController.js';
import { verifyToken } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/new', verifyToken, showNewSplitBillForm);
router.get('/:id', verifyToken, getGroup);

router.post('/new', verifyToken, createGroups);
router.delete('/:groupId/delete' , verifyToken, deleteGroup)

export default router;
