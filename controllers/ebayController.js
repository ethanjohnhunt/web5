const axios = require('axios');
const querystring = require('querystring'); // For encoding form data
require('dotenv').config(); // Load environment variables


const exchangeAuthCodeForToken = async (req, res) => {
    const { code } = req.query; // Extract the 'code' query parameter from the callback URL

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is missing' });
    }

    try {
        // eBay API credentials from .env
        const clientId = process.env.EBAY_SANDBOX_CLIENT_ID;
        const clientSecret = process.env.EBAY_SANDBOX_CLIENT_SECRET;
        const ruName = process.env.EBAY_SANDBOX_RU_NAME;

        // Base64 encode clientId and clientSecret
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        // Prepare the request body
        const tokenData = querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: ruName, // Must match your registered RuName
        });

        // Make POST request to eBay token endpoint
        const response = await axios.post(
            'https://api.sandbox.ebay.com/identity/v1/oauth2/token',
            tokenData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${credentials}`,
                },
            }
        );

        // Extract tokens from response
        const { access_token, refresh_token, expires_in } = response.data;

        // Send tokens back to the client
        res.status(200).json({
            message: 'Tokens retrieved successfully',
            access_token,
            refresh_token,
            expires_in,
        });

        // TODO: Optionally store tokens in your database for later use
        // Example: await saveTokensToDatabase(userId, access_token, refresh_token);
    } catch (error) {
        console.error('Error exchanging authorization code:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to exchange authorization code for tokens' });
    }
};

module.exports = { exchangeAuthCodeForToken };
