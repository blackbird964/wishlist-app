import fs from 'fs/promises';

// Function to read wishlist
async function readWishlist() {
    try {
        const data = await fs.readFile('./data/wishlist.json', 'utf8');
        console.log('Successfully read wishlist data:');
        console.log(data);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading wishlist:', error);
        return [];
    }
}

// Function to add item to wishlist
async function addWishlistItem(item) {
    try {
        const wishlist = await readWishlist();
        wishlist.push(item);
        await fs.writeFile('./data/wishlist.json', JSON.stringify(wishlist, null, 2));
        console.log('Successfully added item to wishlist!');
    } catch (error) {
        console.error('Error adding item:', error);
    }
}

// Test the functions
async function test() {
    // Read current wishlist
    await readWishlist();

    // Add a test item
    const testItem = {
        id: Date.now(),
        productId: "test123",
        productTitle: "Test Product",
        price: 29.99,
        contributions: []
    };

    await addWishlistItem(testItem);
    
    // Read again to verify
    await readWishlist();
}

test();