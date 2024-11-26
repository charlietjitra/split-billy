import Group from '../model/groupSchema.js';  
import Expense from "../model/expenseSchema.js";
import { calculateFinances } from '../utils/calculateFinances.js';

// Show New Split Bill Form
export const showNewSplitBillForm = (req, res) => {
    res.render('split/new', { user: req.user });
};

// Create a new group
export const createGroups = async (req, res) => {
    try {
        const groupName = req.body.groupName;
        const members = req.body['members[]'];

        if (!groupName || !members || members.length === 0) {
            return res.status(400).send("Group name and members are required.");
        }

        const group = new Group({
            groupName,
            members: members,    
            googleID: req.user.googleID
        });

        await group.save(); 
        console.log(Array.isArray(group.members));  // This should return true if it's an array
        console.log(group.members);  // This will show the members

        res.redirect(`/split/group/${group._id}`);
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).send("Server Error");
    }
};
// Get Group Details and Expenses
export const getGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).send("Group not found");
        }

        const expenses = await Expense.find({ groupId: group._id });
        const { balances, settlements } = calculateFinances(expenses, group.members);
        
        // Fetch the expense to edit if query parameter is present
        const expenseToEdit = req.query.edit ? await Expense.findById(req.query.edit) : null;

        // Render the group view, passing the necessary data
        res.render('split/group', { 
            group, 
            expenses, 
            balances, 
            settlements, 
            user: req.user, 
            expenseToEdit  // Pass expenseToEdit to the view
        });
    } catch (err) {
        console.error("Error fetching group:", err);
        res.status(500).send("Server error");
    }
};


// Add New Expense
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

// Edit an Expense
export const editExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;  // Expense ID from URL
        const { description, amount, paidBy, splitBetween } = req.body;  // Updated values from form

        if (!description || !amount || !paidBy || !splitBetween) {
            return res.status(400).send('Missing required details');
        }

        // Update the expense in the database
        const updatedExpense = await Expense.findByIdAndUpdate(
            expenseId,
            {
                description,
                amount: Number(amount),
                paidBy,
                splitBetween  // This can be updated depending on your requirements
            },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).send('Expense not found');
        }

        // Redirect to the group page with updated expenses
        res.redirect(`/split/group/${updatedExpense.groupId}`);
    } catch (err) {
        console.error('Error updating expense:', err);
        res.status(500).send('Error editing expense');
    }
};

// Controller to display the form pre-filled with existing expense data

export const editExpensePage = async (req, res) => {
    try {
        const { expenseId } = req.params;  // Expense ID from the URL
        const expense = await Expense.findById(expenseId);  // Fetch the expense from the database
        const group = await Group.findById(expense.groupId);  // Fetch the group associated with the expense

        if (!expense) {
            return res.status(404).send('Expense not found');
        }

        // Render the group page with the expense data included
        res.render('split/group', { 
            group, 
            expenseToEdit: expense,  // Pass the expense to edit to the view
            user: req.user
        });
    } catch (err) {
        console.error('Error fetching expense:', err);
        res.status(500).send('Server Error');
    }
};

// Edit an Expense (Update in database)
export const updateExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;  // Expense ID from URL
        const { description, amount, paidBy, splitBetween } = req.body;  // Updated values from the form

        if (!description || !amount || !paidBy || !splitBetween) {
            return res.status(400).send('Missing required details');
        }

        // Format splitBetween to match the schema structure
        const formattedSplitBetween = splitBetween.map(member => ({
            member,  // Member's name
            share: amount / splitBetween.length  // Share is the amount divided by the number of members
        }));
        
        // Find the expense and update it
        const updatedExpense = await Expense.findByIdAndUpdate(
            expenseId,
            {
                description,
                amount: Number(amount),
                paidBy,
                splitBetween: formattedSplitBetween  // Store formatted splitBetween
            },
            { new: true }  // This ensures that the updated document is returned
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

// Delete an Expense
export const deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        
        // Find the expense and remove it
        const expense = await Expense.findByIdAndDelete(expenseId);

        if (!expense) {
            return res.status(404).send('Expense not found');
        }

        // Remove the expense reference from the group
        await Group.findByIdAndUpdate(expense.groupId, {
            $pull: { expenses: expense._id }
        });

        res.redirect(`/split/group/${expense.groupId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting expense');
    }
};

export const getHistoryPage = async (req, res) => {
    try {
        // Fetch all groups associated with the logged-in user
        const groups = await Group.find({ googleID: req.user.googleID }).populate('expenses');

        // Check if a specific expense is being edited (based on a query parameter)
        const expenseId = req.query.expenseId;
        let expense = null;
        let group = null;

        if (expenseId) {
            // Fetch the specific expense
            expense = await Expense.findById(expenseId);
            if (expense) {
                // Fetch the group related to the expense
                group = await Group.findById(expense.groupId);
            }
        }

        // Debugging: Log the fetched groups and expense data
        console.log('Groups:', groups);
        console.log('Editing Expense:', expense);
        console.log('Editing Group:', group);

        // Render the page with group and expense details
        res.render('split/history', {
            groups,
            user: req.user,
            editingExpense: expense, // Pass expense details if editing
            editingGroup: group,     // Pass group details if editing
        });
    } catch (err) {
        console.error('Error fetching group history:', err);
        res.status(500).send('Internal Server Error');
    }
};
