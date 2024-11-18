import { Router } from 'express';
import { showNewSplitBillForm, createGroups } from '../../controller/newController.js';
import { verifyToken } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/new',verifyToken, showNewSplitBillForm);

router.post('/new',verifyToken, createGroups);




export default router;
