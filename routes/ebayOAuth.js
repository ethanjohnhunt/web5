const express = require('express');
const axios = require('axios');
const qs = require('qs');
const authenticateJWT = require('../middleware/authenticateJWT'); // JWT authentication middleware
const User = require('../models/User'); // Import your User model

const EBAY_CLIENT_ID = process.env.EBAY_CLIENT_ID;
const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
const EBAY_REDIRECT_URI = process.env.EBAY_REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

const router = express.Router();
const scopes = [
    'https://api.ebay.com/oauth/api_scope',
    'https://api.ebay.com/oauth/api_scope/sell.marketing.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.marketing',
    'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.inventory',
    'https://api.ebay.com/oauth/api_scope/sell.account.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.account',
    'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.fulfillment',
];

const ebayAuthURL = `https://auth.ebay.com/oauth2/authorize?client_id=${EBAY_CLIENT_ID}&response_type=code&redirect_uri=${EBAY_REDIRECT_URI}&scope=${scopes.join(' ')}`;

router.get('/login-with-ebay', authenticateJWT,(req, res) => {
    res.redirect(ebayAuthURL);
});

router.get('/callback',authenticateJWT, async (req, res) => {
    const authorizationCode = req.query.code;

    if (!authorizationCode) {
        return res.status(400).send('Authorization code is missing.');
    }

    try {
        const tokenResponse = await axios.post(
            'https://api.ebay.com/identity/v1/oauth2/token',
            qs.stringify({
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: EBAY_REDIRECT_URI
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString('base64')}`
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;
        const userId = req.user.id; //I am also getting the USER ID from when to link the ebay token & username to store / update db
        const user = await User.findByIdAndUpdate(
            userId,
            {
                linkedEbay: true,
                ebayToken: accessToken,
                ebayTokenExpiry: Date.now() + tokenResponse.data.expires_in * 1000, // Calculate expiry time
            },
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).send('User not found.');
        }
        
      console.log({accessToken});
    res.redirect(`${FRONTEND_URL}?success=true`);
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        res.status(500).send('Error retrieving access token.');
    }
});

router.get('/getListings', authenticateJWT, async (req, res) => {
  try {
      // Retrieve the authenticated user's eBay token from the database
      const user = await User.findById(req.user.id);

      if (!user || !user.ebayToken) {
          return res.status(401).json({ error: 'eBay account not linked.' });
      }

      // Call eBay's API to fetch inventory items
      const response = await axios.get('https://api.ebay.com/sell/inventory/v1/inventory_item?limit=50', {
          headers: {
              Authorization: `Bearer ${user.ebayToken}`,
          },
      });

      // Send the eBay listings back to the frontend
      res.status(200).json(response.data);
  } catch (error) {
      console.error('Error fetching eBay listings:', error.response?.data || error.message);
      if (error.response?.status === 401) {
          return res.status(401).json({ error: 'eBay token expired or invalid. Please relink your eBay account.' });
      }
      res.status(500).json({ error: 'Failed to fetch eBay listings.' });
  }
});

module.exports = router;
