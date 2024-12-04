import express from 'express';
import { WishlistStorage } from './src/services/storage.js';
import cors from 'cors';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Shopify
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ['read_products', 'write_orders'],
  hostName: process.env.HOST.replace(/https?:\/\//, ''),
  apiVersion: LATEST_API_VERSION,
});

// Your existing endpoints
// ... (keep your wishlist endpoints)

// Add Shopify authentication
app.get('/auth', async (req, res) => {
  const shop = req.query.shop;
  
  if (!shop) {
    return res.status(400).send('No shop provided');
  }

  const authRoute = await shopify.auth.begin({
    shop,
    callbackPath: '/auth/callback',
    isOnline: true,
  });

  res.redirect(authRoute);
});

app.get('/auth/callback', async (req, res) => {
  try {
    const callback = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    // Store the session somewhere
    console.log('Auth successful', callback);
    
    res.redirect('/');
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});