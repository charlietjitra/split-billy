import { Router } from 'express';
import { showNewSplitBillForm, createGroups, addPayment, showGroupPage } from '../../controller/newController.js';
import { verifyToken } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/new',verifyToken, showNewSplitBillForm);
router.get('/group', verifyToken, showGroupPage);
router.post('/new', verifyToken, createGroups);
router.post('/group', verifyToken, addPayment);



export default router;
