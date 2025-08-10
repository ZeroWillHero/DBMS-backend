const Parent = require("../../../models/Parent");
const User = require("../../../models/User");

const createParent = async (req, res) => {
    try {
        const { name, phone, nic, user } = req.body;
        console.log('Received create parent request:', req.body);
        const foundedUser = await User.findById(user);
        if (!foundedUser) {
            return res.status(404).json({ message: "User not founded for the related" });
        }

        const parent = new Parent({
            name,
            phone,
            nic,
            user
        });

        const savedParent = await parent.save();

        return res.status(200).json({ message: "Parent created successfully" , parent: savedParent });


    } catch (error) {
        console.error("Error creating parent:", error);
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
}

module.exports = createParent;