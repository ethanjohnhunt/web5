    const jwt = require('jsonwebtoken');

    /**
     * Generate a JWT for a user.
     * @param {Object} payload - The payload to encode in the token (e.g., user ID, username).
     * @param {string} secret - The secret key to sign the token.
     * @param {Object} options - Additional options (e.g., token expiration time).
     * @returns {string} - The signed JWT.
     */
    const generateToken = (payload, secret, options = {}) => {
        return jwt.sign(payload, secret, options);
    };

    module.exports = generateToken;
