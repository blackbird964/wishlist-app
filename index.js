import express from 'express';
import { WishlistStorage } from './src/services/storage.js';
import cors from 'cors';
import dotenv from 'dotenv';
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors({
    origin: 'https://wishgranted-test.myshopify.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
  }));
app.use(express.json());
app.use(express.static('public'));  // Add this line

// Your existing code here...
// Add this near your other routes in index.js
app.post('/api/wishlist', async (req, res) => {
    try {
      const { productId, productTitle, price } = req.body;
      const wishlist = new WishlistStorage();
      
      const item = await wishlist.addItem({
        productId,
        productTitle,
        price
      });
      
      res.status(201).json(item);
    } catch (error) {
      console.error('Error adding item:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/wishlist', async (req, res) => {
    try {
      const wishlist = new WishlistStorage();
      const items = await wishlist.getItems();
      res.json(items);
    } catch (error) {
      console.error('Error getting items:', error);
      res.status(500).json({ error: error.message });
    }
  });
  app.get('/shopify', (req, res) => {
    const shop = req.query.shop;
    if (!shop) return res.status(400).send('No shop provided');
    
    const authRoute = shopify.auth.begin({
      shop,
      callbackPath: '/auth/callback',
      isOnline: true,
    });
    
    res.redirect(authRoute);
  });

  app.get('/auth/callback', async (req, res) => {
    try {
      const { shop } = req.query;
      await shopify.auth.callback({
        rawRequest: req,
        rawResponse: res,
      });
      
      res.redirect(`/?shop=${shop}`);
    } catch (error) {
      console.error('Auth error:', error);
      res.status(500).send(error.message);
    }
  });

  app.post('/api/round-up-contribute', async (req, res) => {
    try {
      const { amount } = req.body;
      const wishlist = new WishlistStorage();
      const items = await wishlist.getItems();
      
      // Find first unfulfilled item
      const targetItem = items.find(item => !item.fulfilled);
      
      if (targetItem) {
        await wishlist.addContribution(targetItem.id, {
          amount: parseFloat(amount),
          anonymous: true,
          source: 'round-up'
        });
        
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'No wishlist items available' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


// Add this at the end
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});