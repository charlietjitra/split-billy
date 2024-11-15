import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleID: { type: String, required: true },
    name: String,
    email: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;
