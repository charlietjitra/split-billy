import Group from '../model/groupSchema.js';  

export const showNewSplitBillForm = (req, res) => {
    res.render('split/new',{ user: req.user });
};

export const showGroupPage = (req,res) => {
    res.render('split/group');

}

export const createGroups = async (req, res) => {
    try {
        const groupName = req.body.groupName;
        const members = req.body['members[]']; // Accessing members array directly

        //console.log('Request Body:', req.body); // Log the entire request body for debugging
        //console.log('Group Name:', groupName);  // Log the group name
        //console.log('Members:', members);       // Log the members

        // Validation: Ensure required fields are provided
        if (!groupName || !members || members.length === 0) {
            return res.status(400).send("Group name and members are required.");
        }

        // Create group object
        const group = new Group({
            groupName: groupName,
            members: members,    
            googleID: req.user.googleID
        });

        console.log('Group Object:', group); // Log the created group object

        await group.save(); // Save to MongoDB
        console.log('Group saved:', group.groupName);
        console.log('Members saved:', group.members);

        // Redirect to a success page or send a success response
        res.render('split/group', { group: groupName, members });
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).send("Server Error");
    }
};

export const addPayment = async (req, res) => {
    try {
        // Fetch the group name from the request
        const groupName = req.body.group || req.params.groupName; // Flexible source for groupName
        const group = await Group.findOne({ groupName, googleID: req.user.googleID });

        if (!group) {
            return res.status(404).send("Group not found.");
        }
    console.log(group);
        // Render addPayment.ejs with the group and members data
        res.render('split/addPayment', { group: group.groupName, members: group.members });
    } catch (error) {
        console.error("Error fetching group for payment:", error);
        res.status(500).send("Server Error");
    }
};
