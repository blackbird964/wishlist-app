const { useState, useEffect } = React;

function WishlistApp() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Community Wishlist</h1>
      
      {loading ? (
        <p>Loading wishlist...</p>
      ) : items.length === 0 ? (
        <p>No items in wishlist yet!</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{item.productTitle}</h2>
              <p className="text-gray-600">Price: ${item.price}</p>
              <div className="mt-2">
                <progress 
                  value={item.totalContributed || 0} 
                  max={item.price} 
                  className="w-full"
                />
                <p className="text-sm text-gray-500">
                  ${item.totalContributed || 0} of ${item.price} funded
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(WishlistApp));