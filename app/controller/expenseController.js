import Group from '../model/groupSchema.js';  
import Expense from "../model/expenseSchema.js";

export const addExpenses = async (req, res) => {
    try {
        const { description, amount, paidBy, splitBetween } = req.body;
        const { groupId } = req.params;

        if (!description || !amount || !paidBy || !splitBetween) {
            return res.status(400).send('Missing required details');
        }

        const selectedMembers = Array.isArray(splitBetween) ? splitBetween : [splitBetween];
        const shareAmount = Number((amount / splitBetween.length)).toFixed(2);

        const splitDetails = selectedMembers.map(member => ({
            member,
            share: shareAmount
        }));

        const expense = new Expense({
            groupId: groupId,
            description,
            amount: Number(amount),
            paidBy,
            splitBetween: splitDetails
        });

        await expense.save();

        await Group.findByIdAndUpdate(groupId, {
            $push: { expenses: expense._id }
        });

        res.redirect(`/split/group/${groupId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding expenses');
    }
};

export const editExpensePage = async (req, res) => {
    try {
        const { expenseId } = req.params;  
        const expense = await Expense.findById(expenseId);  
        const group = await Group.findById(expense.groupId);  

        if (!expense) {
            return res.status(404).send('Expense not found');
        }

        res.render('split/group', { 
            group, 
            expenseToEdit: expense,  
            user: req.user
        });
    } catch (err) {
        console.error('Error fetching expense:', err);
        res.status(500).send('Server Error');
    }
};

export const updateExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;  
        const { description, amount, paidBy, splitBetween } = req.body;  

        if (!description || !amount || !paidBy || !splitBetween) {
            return res.status(400).send('Missing required details');
        }

        const formattedSplitBetween = splitBetween.map(member => ({
            member,  
            share: amount / splitBetween.length  
        }));
        
        const updatedExpense = await Expense.findByIdAndUpdate(
            expenseId,
            {
                description,
                amount: Number(amount),
                paidBy,
                splitBetween: formattedSplitBetween  
            },
            { new: true }  
        );

        if (!updatedExpense) {
            return res.status(404).send('Expense not found');
        }

        // After updating, redirect back to the group page to see the changes
        res.redirect(`/split/group/${updatedExpense.groupId}`);
    } catch (err) {
        console.error('Error updating expense:', err);
        res.status(500).send('Error editing expense');
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const expense = await Expense.findByIdAndDelete(expenseId);

        if (!expense) {
            return res.status(404).send('Expense not found');
        }

        await Group.findByIdAndUpdate(expense.groupId, {
            $pull: { expenses: expense._id }
        });

        res.redirect(`/split/group/${expense.groupId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting expense');
    }
};