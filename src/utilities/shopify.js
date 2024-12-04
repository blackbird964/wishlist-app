async function createShopifyOrder(wishlistItem, shop) {
    const client = new shopify.clients.Rest(shop);
    
    try {
      const order = await client.post({
        path: 'orders',
        data: {
          order: {
            email: wishlistItem.customerEmail,
            line_items: [
              {
                variant_id: wishlistItem.productId,
                quantity: 1
              }
            ],
            financial_status: 'paid',
            send_receipt: true,
            send_fulfillment_receipt: true
          }
        }
      });
  
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
  
  export { createShopifyOrder };