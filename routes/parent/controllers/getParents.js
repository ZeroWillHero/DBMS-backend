const Parent = require("../../../models/Parent")

const getAllParents = async (req,res) => {
    const parents = await Parent.find({}).populate('user', 'firstname lastname alYear email whatsappNumber school role paymentSlip verified qrCode isQRUsede').sort({ createdAt: -1 });
    if (!parents || parents.length === 0) {
        return res.status(404).json({ message: "No parents found" });
    }

    return res.status(200).json({ message: "Parents retrieved successfully", parents });
}

const getParent = async (req,res) => {
    const id = req.params.id;
    try {
        const parent = await Parent.findOne({
            user: id
        }).populate('user', 'firstname lastname alYear email whatsappNumber school role paymentSlip verified qrCode isQRUsede');
        if (!parent) {
            return res.status(404).json({ message: "Parent not found" });
        }
        return res.status(200).json({ message: "Parent retrieved successfully", parent });
    }catch (error) {
        console.error("Error retrieving parent:", error);
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
}

module.exports = { getAllParents, getParent}