const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const { inject } = require('@vercel/analytics');
require('dotenv').config();

// Initialize Vercel Web Analytics
inject({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  debug: process.env.NODE_ENV !== 'production'
});

const app = express();
app.use(express.json());


const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
const PORT = process.env.PORT || 3000;

// ONE endpoint - generate token
app.post('/token', (req, res) => {
  const { channelName, uid = 0 } = req.body;

  if (!channelName) {
    return res.status(400).json({ error: 'channelName required' });
  }

  // Generate token that expires in 1 hour
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    RtcRole.PUBLISHER,
    Math.floor(Date.now() / 1000) + 3600 // 1 hour expiry
  );

  res.json({ token });
});

app.listen(PORT, () => console.log('✅ Token server running on port 3000'));
