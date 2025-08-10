const User = require("../models/User")

const generateTicket = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await User.findById(id);


    } catch (error) {
        console.error("Error generating ticket:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}