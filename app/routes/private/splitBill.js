import { Router } from 'express';
import { showNewSplitBillForm, createGroups, addExpenses, getGroup } from '../../controller/newController.js';
import { verifyToken } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/new',verifyToken, showNewSplitBillForm);
router.get('/group/:id', verifyToken, getGroup);

router.post('/new',verifyToken, createGroups);
router.post('/group/:groupId/expense', verifyToken, addExpenses)

export default router;
