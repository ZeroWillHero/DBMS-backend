const User = require('../../models/User');
const upateQRUsage = async (req,res) => {
    console.log('markQrUsed route hit!');
    try{
        const user_id = req.body.id;
        console.log(user_id)

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await User.findOne({ _id: user_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // update thhe qr is used or not 
        user.isQRUsede = true;
        await user.save();
        return res.status(200).json({ message: 'QR usage updated successfully' });
    }catch (error) {
        console.error('Error updating QR usage:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}

module.exports = upateQRUsage;