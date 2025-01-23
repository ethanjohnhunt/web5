const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is defined in your environment variables
const JWT_EXPIRATION = '1d'; // Token expiration (e.g., 1 day)
exports.registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(409).json({
                error: `Account already exists with this ${existingUser.username === username ? 'username' : 'email'}.`
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Generate a JWT for the new user
        const token = jwt.sign(
            { id: newUser._id, username: newUser.username, email: newUser.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        // Set the token as an HttpOnly cookie
        res.cookie('authToken', token, {
            httpOnly: true, // Prevent JavaScript access to the cookie
            secure: false, // Set to true in production with HTTPS
            sameSite: 'strict', // Mitigate CSRF
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // Respond with user details (excluding the token for security reasons)
        res.status(201).json({
            message: 'User registered successfully!',
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
            redirectTo: '/home', // Send the path for redirection
        });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'An internal error occurred.' });
    }
};
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Compare the  password with the stored hash pword
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Generate a JWT
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        res.cookie('authToken', token, {
            httpOnly: true, 
            secure: false, 
            sameSite: 'strict', // Mitigate CSRF
            maxAge: 24 * 60 * 60 * 1000, 
        });

        // Respond with user details (excluding the token for security reasons)
        res.status(200).json({
            message: 'Login successful!',
            user: { id: user._id, username: user.username, email: user.email },
            redirectTo: '/home', // Send the path for redirection
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'An internal error occurred.' });
    }
};
