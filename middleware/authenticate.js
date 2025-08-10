const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkIsAdmin = async (req,res,next) => {
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
        return res.status(401).json({ message: 'Access token is required' });
    }

    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    try {
        const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        const user = await User.findById(decode.user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        req.user = user;
        next();
    }catch (error) {
        console.error('Error verifying access token:', error);
        return res.status(401).json({ message: 'Invalid access token' });
    }

}

module.exports = {checkIsAdmin};