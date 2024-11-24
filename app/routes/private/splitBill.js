import { Router } from 'express';
import { showNewSplitBillForm, createGroups, addExpenses, getGroup, editExpense, deleteExpense, editExpensePage, updateExpense, getHistoryPage } from '../../controller/newController.js';
import { verifyToken } from '../../middleware/authMiddleware.js';

const router = Router();

// Routes for displaying and creating group
router.get('/new', verifyToken, showNewSplitBillForm);
router.get('/group/:id', verifyToken, getGroup);
router.get('/group/:groupId/expense/:expenseId/edit', verifyToken, editExpensePage);
router.get('/history', verifyToken, getHistoryPage);
// Routes for posting new group and adding expenses
router.post('/new', verifyToken, createGroups);
router.post('/group/:groupId/expense', verifyToken, addExpenses);

// Route for deleting expense (post method)
router.post('/group/:groupId/expense/:expenseId/delete', verifyToken, deleteExpense); // Correct route for deleting expense

router.post('/group/:groupId/expense/:expenseId/edit', verifyToken, updateExpense);  // This handles the expense update
export default router;
