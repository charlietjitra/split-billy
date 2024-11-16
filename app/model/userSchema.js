import mongoose from "mongoose";

// User schema
const userSchema = new mongoose.Schema({
    googleID: { type: String, required: true },
    name: String,
    email: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Group schema
const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    members: [{
        type: String,  // This is a string, but you can change it to ObjectId to reference the User model
        required: true
    }]
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);

// Export both models
export { User, Group };
