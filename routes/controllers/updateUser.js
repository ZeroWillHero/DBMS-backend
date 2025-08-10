// Example update controller
const User = require('../../models/User');

const updateUser = async (req, res) => {
    try {
        // List of fields that should NOT be updated by users
        const protectedFields = ['verified', 'qrCode'];

        // Remove protected fields from req.body
        protectedFields.forEach(field => {
            if (field in req.body) {
                delete req.body[field];
            }
        });

        // Now update only allowed fields
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { updateUser };