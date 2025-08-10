const jwt = require('jsonwebtoken');
const User = require('./../models/User');

const generateAccessToken = require('./accessTokenGenerator');

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateNewAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
    console.error('Refresh token is required');
    return res.status(401).json({ message: 'Refresh token is required' });
}
    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        // Find the user associated with the refresh token
        const user = await User.findById(decoded.user_id);
        if (!user || user.refreshToken !== refreshToken) {
            console.error('Invalid refresh token or user not found');
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Generate a new access token
        const newAccessToken = generateAccessToken(user._id, user.email);
        // Optionally, you can also update the user's refresh token if needed
        // user.refreshToken = generateRefreshToken({ user_id: user._id, email: user.email });
        user.refreshToken = refreshToken; // Keep the same refresh token
        await user.save();
        // Return the new access token
        console.log('New access token generated successfully');
        console.log('New access token:', newAccessToken);
        console.log('User ID:', user._id);
        res.status(200).json({
            message: 'New access token generated successfully',
            accessToken: newAccessToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Error generating new access token:', error);
        res.status(500).json({ message: 'Failed to generate new access token', error: error.message });
    }
}

module.exports = generateNewAccessToken;