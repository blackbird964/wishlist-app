import fs from 'fs/promises';

export class WishlistStorage {
    constructor() {
        this.filePath = './data/wishlist.json';
    }

    async readWishlist() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading wishlist:', error);
            return [];
        }
    }

    async saveWishlist(wishlist) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(wishlist, null, 2));
        } catch (error) {
            console.error('Error saving wishlist:', error);
            throw error;
        }
    }

    async addItem(item) {
        const wishlist = await this.readWishlist();
        const newItem = {
            id: Date.now(),
            ...item,
            contributions: [],
            totalContributed: 0,
            fulfilled: false,
            createdAt: new Date().toISOString()
        };
        wishlist.push(newItem);
        await this.saveWishlist(wishlist);
        return newItem;
    }

    async getItems() {
        return this.readWishlist();
    }

    async addContribution(itemId, contribution) {
        const wishlist = await this.readWishlist();
        const item = wishlist.find(i => i.id === itemId);
        
        if (!item) {
            throw new Error('Item not found');
        }

        item.contributions.push({
            id: Date.now(),
            ...contribution,
            createdAt: new Date().toISOString()
        });

        item.totalContributed = item.contributions.reduce(
            (sum, c) => sum + c.amount, 
            0
        );

        if (item.totalContributed >= item.price && !item.fulfilled) {
            item.fulfilled = true;
            // Here you would trigger the Shopify order creation
        }

        await this.saveWishlist(wishlist);
        return item;
    }
}