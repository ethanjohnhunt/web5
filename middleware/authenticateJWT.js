const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is defined in your environment variables

/**
 * Middleware to authenticate JWTs for protected routes.
 * Verifies the token and attaches user info to the request object.
 */
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header

    if (!token) {
        return res.status(403).json({ error: 'Token is missing.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
        req.user = decoded; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = authenticateJWT;
