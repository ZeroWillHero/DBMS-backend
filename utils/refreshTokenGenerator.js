const jwt = require('jsonwebtoken');

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
// const REFRESH_TOKEN_TIMEOUT = process.env.REFRESH_TOKEN_EXPIRY;


function generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '3d' });
}

module.exports = generateRefreshToken;