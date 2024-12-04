import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  shopId: String,
  productId: String,
  productTitle: String,
  productImage: String,
  price: Number,
  customerEmail: String,
  contributions: [{
    customerEmail: String,
    amount: Number,
    anonymous: Boolean,
    createdAt: { type: Date, default: Date.now }
  }],
  totalContributed: { type: Number, default: 0 },
  fulfilled: { type: Boolean, default: false }
});

export const WishlistItem = mongoose.model('WishlistItem', wishlistItemSchema);