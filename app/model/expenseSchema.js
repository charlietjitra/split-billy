import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paidBy: {
        type: String,
        required: true
    },
    splitBetween: [{
        member: String, 
        share: Number
    }],
    date: {
        type: Date,
        default: Date.now
    }
})

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;