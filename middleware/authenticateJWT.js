const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.authToken; 

    if (!token) {
        console.error('Token is missing.');
        return res.redirect('/login'); // Redirects to the login page
    }


    try {
        const decoded = jwt.verify(token, JWT_SECRET); 
        req.user = decoded; 
        next();
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = authenticateJWT;
