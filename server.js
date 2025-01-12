const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config(); 

// Import routes
const ebayRoutes = require('./routes/ebayRoutes'); // Import the eBay routes
const gridRoutes = require('./routes/gridRoutes'); // Grid-related routes
const authRoutes = require('./routes/authRoutes'); // Authentication-related routes

//Logging env variables
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('MONGO_URI:', process.env.MONGO_URI);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors({

    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow requests from frontend during development
}));

// Serve static files from React build folder (for production)
app.use(express.static(path.join(__dirname, 'build')));

// API Routes
app.use('/api/grid', gridRoutes); // Grid-related routes
app.use('/api/auth', authRoutes); // Authentication-related routes
app.use('/api/ebay', ebayRoutes); // Add eBay-related routes

// Catch-all route to serve React frontend (for React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
