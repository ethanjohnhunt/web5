const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const ebayOAuthRoutes = require('./routes/ebayOAuth');
const gridRoutes = require('./routes/gridRoutes');
const authenticateJWT = require('./middleware/authenticateJWT'); // Middleware to protect routes

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/grid', authenticateJWT, gridRoutes);
app.use('/api/ebay', authenticateJWT, ebayOAuthRoutes);

// Serve static React files in production
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
