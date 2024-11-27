import Group from '../model/groupSchema.js';  
import Expense from "../model/expenseSchema.js";
import { calculateFinances } from '../utils/calculateFinances.js';

export const getHistoryPage = async (req, res) => {
    try {
        //fetch all the groups
        const groups = await Group.find({ googleID: req.user.googleID }).populate('expenses');

        const expenseId = req.query.expenseId;
        let expense = null;
        let group = null;

        if (expenseId) {
            expense = await Expense.findById(expenseId);
            if (expense) {
                group = await Group.findById(expense.groupId);
            }
        }
     
        //console.log('Groups:', groups);
        //console.log('Editing Expense:', expense);
        //console.log('Editing Group:', group);

        res.render('split/history', {
            groups,
            user: req.user,
            editingExpense: expense, 
            editingGroup: group,     
        });
    } catch (err) {
        console.error('Error fetching group history:', err);
        res.status(500).send('Internal Server Error');
    }
};

