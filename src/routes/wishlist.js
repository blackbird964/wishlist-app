import express from 'express';
import { WishlistItem } from '../models/wishlistItem.js';

const router = express.Router();

// Add item to wishlist
router.post('/api/wishlist', async (req, res) => {
  try {
    const { productId, price, customerEmail } = req.body;
    
    // Fetch product details from Shopify
    const client = new shopify.clients.Rest(req.shop);
    const product = await client.get({
      path: `products/${productId}`,
    });

    const wishlistItem = new WishlistItem({
      productId,
      productTitle: product.title,
      productImage: product.images[0]?.src,
      price,
      customerEmail,
      shopId: req.shop.id
    });

    await wishlistItem.save();
    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get wishlist items
router.get('/api/wishlist', async (req, res) => {
  try {
    const items = await WishlistItem.find({
      shopId: req.shop.id,
      fulfilled: false
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contribute to wishlist item
router.post('/api/wishlist/:id/contribute', async (req, res) => {
  try {
    const { amount, customerEmail, anonymous } = req.body;
    const wishlistItem = await WishlistItem.findById(req.params.id);

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    wishlistItem.contributions.push({
      customerEmail,
      amount,
      anonymous
    });

    wishlistItem.totalContributed += amount;

    // Check if item is fully funded
    if (wishlistItem.totalContributed >= wishlistItem.price) {
      wishlistItem.fulfilled = true;
      // Create Shopify order
      await createShopifyOrder(wishlistItem, req.shop);
    }

    await wishlistItem.save();
    res.json(wishlistItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;