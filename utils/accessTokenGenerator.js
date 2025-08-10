const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_TIMEOUT = process.env.ACCESS_TOKEN_EXPIRY;


function generateAccessToken(user_id, email) {
    const payload = { user_id, email };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TIMEOUT });
}

module.exports = generateAccessToken;