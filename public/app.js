const { useState, useEffect } = React;

function WishlistApp() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ productTitle: '', price: '' });

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

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: Date.now().toString(),
          productTitle: newItem.productTitle,
          price: parseFloat(newItem.price)
        })
      });
      
      if (response.ok) {
        setNewItem({ productTitle: '', price: '' });
        fetchWishlistItems();
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return React.createElement("div", { className: "p-6 max-w-4xl mx-auto" },
    React.createElement("h1", { className: "text-3xl font-bold mb-6" }, "Community Wishlist"),
    
    // Add Item Form
    React.createElement("div", { className: "bg-white p-6 rounded-lg shadow mb-6" },
      React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Add New Item"),
      React.createElement("form", { onSubmit: handleAddItem, className: "space-y-4" },
        React.createElement("input", {
          type: "text",
          value: newItem.productTitle,
          onChange: (e) => setNewItem({...newItem, productTitle: e.target.value}),
          placeholder: "Product Name",
          className: "w-full p-2 border rounded",
          required: true
        }),
        React.createElement("input", {
          type: "number",
          value: newItem.price,
          onChange: (e) => setNewItem({...newItem, price: e.target.value}),
          placeholder: "Price",
          className: "w-full p-2 border rounded",
          step: "0.01",
          min: "0",
          required: true
        }),
        React.createElement("button", {
          type: "submit",
          className: "w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        }, "Add to Wishlist")
      )
    ),

    // Wishlist Items
    loading ? 
      React.createElement("p", null, "Loading wishlist...") :
      items.length === 0 ?
        React.createElement("p", null, "No items in wishlist yet!") :
        React.createElement("div", { className: "space-y-4" },
          items.map(item => 
            React.createElement("div", { 
              key: item.id,
              className: "bg-white p-6 rounded-lg shadow"
            },
              React.createElement("h3", { className: "text-xl font-semibold" }, item.productTitle),
              React.createElement("p", { className: "text-gray-600" }, `Price: $${item.price}`),
              React.createElement("div", { className: "mt-2" },
                React.createElement("div", { className: "w-full bg-gray-200 rounded-full h-2.5" },
                  React.createElement("div", {
                    className: "bg-blue-500 h-2.5 rounded-full",
                    style: { width: `${(item.totalContributed || 0) / item.price * 100}%` }
                  })
                ),
                React.createElement("p", { className: "text-sm text-gray-500 mt-1" },
                  `$${item.totalContributed || 0} of $${item.price} funded`
                )
              )
            )
          )
        )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(WishlistApp));