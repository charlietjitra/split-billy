import Group from '../model/groupSchema.js';  
import Expense from "../model/expenseSchema.js";
import { calculateFinances } from '../utils/calculateFinances.js';

export const showNewSplitBillForm = (req, res) => {
    res.render('split/new', { user: req.user });
};

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
        //console.log(Array.isArray(group.members));  
        //console.log(group.members);  

        res.redirect(`/split/group/${group._id}`);
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).send("Server Error");
    }
};

export const getGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).send("Group not found");
        }

        const expenses = await Expense.find({ groupId: group._id });
        const { balances, settlements } = calculateFinances(expenses, group.members);
        
        //fetch the expense to edit if query parameter is present
        const expenseToEdit = req.query.edit ? await Expense.findById(req.query.edit) : null;

        res.render('split/group', { 
            group, 
            expenses, 
            balances, 
            settlements, 
            user: req.user, 
            expenseToEdit  
        });
    } catch (err) {
        console.error("Error fetching group:", err);
        res.status(500).send("Server error");
    }
};

export const deleteGroup = async(req,res) => {
    try{
        const group = await Group.findByIdAndDelete(req.params.groupId);
        if (!group) {
            return res.status(404).send("Group not found");
        }
        res.redirect('/split/history')
    }catch(err){
        console.error("Error fetching group:", err);
        res.status(500).send("Server error");
    }
}