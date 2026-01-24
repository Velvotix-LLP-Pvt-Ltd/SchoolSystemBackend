const axios = require("axios");

// Get OAuth token using client credentials
exports.getOAuthToken = async (req, res) => {
  try {
    const { tokenUrl, clientId, clientSecret, scope } = req.body;

    if (!tokenUrl || !clientId || !clientSecret || !scope) {
      return res.status(400).json({
        message: "tokenUrl, clientId, clientSecret, and scope are required",
      });
    }

    const tokenResponse = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    res.json({
      accessToken: tokenResponse.data.access_token,
      tokenType: tokenResponse.data.token_type,
      expiresIn: tokenResponse.data.expires_in,
      scope: tokenResponse.data.scope,
    });
  } catch (error) {
    console.error("OAuth token error:", error.response?.data || error.message);

    res.status(500).json({
      message: "Failed to fetch OAuth token",
      error: error.response?.data || error.message,
    });
  }
};
