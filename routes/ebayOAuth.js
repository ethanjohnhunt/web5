const express = require('express');
const axios = require('axios');
const qs = require('qs');

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

router.get('/login-with-ebay', (req, res) => {
    res.redirect(ebayAuthURL);
});

router.get('/callback', async (req, res) => {
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
      console.log({accessToken});
    res.redirect(`${FRONTEND_URL}?success=true`);
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        res.status(500).send('Error retrieving access token.');
    }
});

module.exports = router;
