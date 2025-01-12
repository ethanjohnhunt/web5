const express = require('express');
const { exchangeAuthCodeForToken } = require('../controllers/ebayController');
const router = express.Router();

// Route to initiate eBay OAuth flow
router.get('/login-with-ebay', (req, res) => {
    const clientId = process.env.EBAY_SANDBOX_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.EBAY_SANDBOX_RU_NAME);
    const scopes = encodeURIComponent('https://api.ebay.com/oauth/api_scope/sell.inventory');
    const state = 'custom_state'; // Optional, for tracking requests

    const authUrl = `https://auth.sandbox.ebay.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&state=${state}`;
    
    // Redirect user to eBay OAuth
    res.redirect(authUrl);
});

// Route to handle the callback from eBay OAuth
router.get('/ebay-oauth/callback', exchangeAuthCodeForToken);

module.exports = router;
