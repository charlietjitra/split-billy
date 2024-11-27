import { Router } from 'express';
import { addExpenses, deleteExpense, editExpensePage, updateExpense } from "../../controller/expenseController.js"
import { verifyToken } from '../../middleware/authMiddleware.js';

const router = Router();
//split/expense/...
router.get('/:groupId/expense/:expenseId/edit', verifyToken, editExpensePage);
router.post('/:groupId/expense', verifyToken, addExpenses);
router.put('/:groupId/expense/:expenseId/edit', verifyToken, updateExpense);
router.delete('/:groupId/expense/:expenseId/delete', verifyToken, deleteExpense);

export default router;
