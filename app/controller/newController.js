import Group from '../model/groupSchema.js';  
import Expense from "../model/expenseSchema.js";
import { calculateFinances } from '../utils/calculateFinances.js';

export const showNewSplitBillForm = (req, res) => {
    res.render('split/new',{ user: req.user });
};

export const createGroups = async (req, res) => {
    try {
        const groupName = req.body.groupName;
        const members = req.body['members[]']; 

        //console.log('Request Body:', req.body); 
        //console.log('Group Name:', groupName);  
        //console.log('Members:', members);       

        // Validation: Ensure required fields are provided
        if (!groupName || !members || members.length === 0) {
            return res.status(400).send("Group name and members are required.");
        }

        // Create group object
        const group = new Group({
            groupName,
            members: members,    
            googleID: req.user.googleID
        });

        //console.log('Group Object:', group); 

        await group.save(); 
        //console.log('Group saved:', group.groupName);
        //console.log('Members saved:', group.members);

        // Redirect to a success page or send a success response
        res.redirect(`/split/group/${group._id}`);
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).send("Server Error");
    }
};

export const getGroup = async(req, res) => {
    try{
        const group = await Group.findById(req.params.id);
        if(!group){
            return res.status(404).send("Group not found");
        }

        const expenses = await Expense.find({groupId: group._id});

        const { balances, settlements } = calculateFinances(expenses, group.members);
        console.log('Balances:', balances);
        console.log('Settlements:', settlements);
        res.render('split/group', {group, expenses, balances, settlements, user: req.user});
    }catch(err){ 
        console.error("error fetching group", err);
        res.status(500).send("server error");
    }
}

export const addExpenses = async(req, res) => {
    try{
        const { description, amount, paidBy, splitBetween } = req.body;
        const { groupId } = req.params;

        console.log(groupId);
        if(!description || !amount || !paidBy || !splitBetween){
            return res.status(400).send('missing required details');
        }

        const selectedMembers = Array.isArray(splitBetween) ? splitBetween : [splitBetween];
        const shareAmount = Number((amount / splitBetween.length)).toFixed(2);

        const splitDetails = selectedMembers.map(member => ({
            member,
            share: shareAmount
        }))

        const expense = new Expense({
            groupId: groupId,
            description,
            amount: Number(amount),
            paidBy,
            splitBetween: splitDetails
        });

        await expense.save();

        await Group.findByIdAndUpdate(groupId, {
            $push: {expenses: expense._id}
        });

        res.redirect(`/split/group/${groupId}`)

    }catch(err){
        console.error(err);
        res.status(500).send('error add expenses')
    }
}