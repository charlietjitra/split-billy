import { Router } from 'express';
import { getHistoryPage } from '../../controller/historyController.js';
import { verifyToken } from '../../middleware/authMiddleware.js';
const router = Router();

router.get('/', verifyToken, getHistoryPage);

export default router;
