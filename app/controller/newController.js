import {Group} from '../model/userSchema.js';  

export const showNewSplitBillForm = (req, res) => {
    res.render('split/new',{ user: req.user });
};

export const createGroups = async (req, res) => {
    try {
        const { groupName, members } = req.body;

        if (!groupName || !members || members.length === 0) {
            return res.status(400).send("Group name and members are required.");
        }

        const group = new Group({
            groupName,
            members: Array.isArray(members) ? members : [members],
        });

        await group.save();
        res.redirect('/split/group');
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).send("Server Error");
    }
};
