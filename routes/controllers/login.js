const User = require('./../../models/User');
const bcrypt = require('bcrypt');

const generateAccessToken = require('./../../utils/accessTokenGenerator');
const generateRefreshToken = require('./../../utils/refreshTokenGenerator');

const login = async (req,res) => {
    const { email,password } = req.body;
    
    try {
        const user = await User.findOne({email : email});
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password or username is incorrect!'});
        }

        // generate access token 
        const accessToken = generateAccessToken(user._id, user.email);
        // generate refresh token
        const refreshToken = generateRefreshToken({ user_id: user._id, email: user.email });
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({
            message: 'Login successful',
            accessToken: accessToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    }catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = login;