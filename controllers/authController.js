const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1h'; 

exports.registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(409).json({
                error: `Account already exists with this ${existingUser.username === username ? 'username' : 'email'}.`
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create and save the new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Generate a JWT
        const token = jwt.sign(
            { id: newUser._id, username: newUser.username, email: newUser.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        // Send the JWT and user info back to the frontend
        res.status(201).json({
            message: 'User registered successfully!',
            token, // JWT token for immediate authentication
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
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

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(200).json({
            message: 'Login successful!',
            token, // Send the token to the frontend
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'An internal error occurred.' });
    }
};
