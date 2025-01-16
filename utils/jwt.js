const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET; 
const ACCESS_TOKEN_EXPIRATION = '1h'; 
const REFRESH_TOKEN_EXPIRATION = '7d';

/**
 * Generate an access token.
 * @param {Object} payload 
 * @returns {string} 
 */
function generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
}

/**
 * Generate a refresh token.
 * @param {Object} payload 
 * @returns {string} 
 */
function generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
}

module.exports = { generateAccessToken, generateRefreshToken };
