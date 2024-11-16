import { Router } from 'express';
import { showNewSplitBillForm, createGroups } from '../../controller/newController.js';
import { verifyToken } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/new',verifyToken, showNewSplitBillForm);
router.post('/group',verifyToken, createGroups); // Handle POST request
router.post('/test', (req, res) => {
    console.log('Submitted Form Data:', req.body);
    res.status(200).json(req.body);
});


export default router;
