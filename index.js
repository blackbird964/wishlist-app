import express from 'express';
import { WishlistStorage } from './src/services/storage.js';
import cors from 'cors';
import dotenv from 'dotenv';
import '@shopify/shopify-api/adapters/node';  // Add this line
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ['read_products', 'write_orders'],
  hostName: process.env.HOST?.replace(/https?:\/\//, '') || 'localhost:3000',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true
});

// Your existing endpoints
// ... (keep your wishlist endpoints)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});