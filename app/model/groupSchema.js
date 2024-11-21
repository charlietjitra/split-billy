import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    members: {
        type: [String], // Array of strings for members
        required: true
    },
    googleID: {
        type: String,
        required: true
    },
    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
