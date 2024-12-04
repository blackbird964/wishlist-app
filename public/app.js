const { useState, useEffect } = React;

const WishlistItem = ({ item, onContribute }) => {
  const [contribution, setContribution] = useState({
    amount: '',
    customerEmail: '',
    anonymous: false
  });

  const handleContribute = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/wishlist/${item.id}/contribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contribution)
      });
      
      if (response.ok) {
        setContribution({ amount: '', customerEmail: '', anonymous: false });
        onContribute();
      }
    } catch (error) {
      console.error('Error contributing:', error);
    }
  };

  const progress = (item.totalContributed / item.price) * 100;

  return React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow mb-4' },
    React.createElement('h3', { className: 'text-xl font-semibold mb-2' }, item.productTitle),
    React.createElement('div', { className: 'mb-4' },
      React.createElement('div', { className: 'flex justify-between text-sm text-gray-600 mb-1' },
        React.createElement('span', null, `$${item.totalContributed} raised`),
        React.createElement('span', null, `Goal: $${item.price}`)
      ),
      React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-2.5' },
        React.createElement('div', {
          className: 'bg-blue-500 h-2.5 rounded-full',
          style: { width: `${Math.min(progress, 100)}%` }
        })
      )
    ),
    !item.fulfilled && React.createElement('form', { onSubmit: handleContribute, className: 'space-y-4' },
      React.createElement('input', {
        type: 'number',
        value: contribution.amount,
        onChange: (e) => setContribution({...contribution, amount: e.target.value}),
        placeholder: 'Contribution Amount',
        className: 'w-full p-2 border rounded',
        step: '0.01',
        min: '0',
        required: true
      }),
      React.createElement('input', {
        type: 'email',
        value: contribution.customerEmail,
        onChange: (e) => setContribution({...contribution, customerEmail: e.target.value}),
        placeholder: 'Your Email',
        className: 'w-full p-2 border rounded',
        required: true
      }),
      React.createElement('div', { className: 'flex items-center' },
        React.createElement('input', {
          type: 'checkbox',
          checked: contribution.anonymous,
          onChange: (e) => setContribution({...contribution, anonymous: e.target.checked}),
          className: 'mr-2'
        }),
        React.createElement('label', null, 'Make contribution anonymous')
      ),
      React.createElement('button', {
        type: 'submit',
        className: 'w-full bg-green-500 text-white p-2 rounded hover:bg-green-600'
      }, 'Contribute')
    ),
    item.fulfilled && React.createElement('div', { className: 'text-green-600 font-semibold mt-2' },
      'This wish has been fulfilled!'
    )
  );
};

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ productTitle: '', price: '' });
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

  return React.createElement('div', { className: 'p-6 max-w-4xl mx-auto' },
    React.createElement('h1', { className: 'text-3xl font-bold mb-6' }, 'Community Wishlist'),
    React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow mb-6' },
      React.createElement('h2', { className: 'text-xl font-semibold mb-4' }, 'Add New Item'),
      React.createElement('form', { onSubmit: handleAddItem, className: 'space-y-4' },
        React.createElement('input', {
          type: 'text',
          value: newItem.productTitle,
          onChange: (e) => setNewItem({...newItem, productTitle: e.target.value}),
          placeholder: 'Product Name',
          className: 'w-full p-2 border rounded',
          required: true
        }),
        React.createElement('input', {
          type: 'number',
          value: newItem.price,
          onChange: (e) => setNewItem({...newItem, price: e.target.value}),
          placeholder: 'Price',
          className: 'w-full p-2 border rounded',
          step: '0.01',
          min: '0',
          required: true
        }),
        React.createElement('button', {
          type: 'submit',
          className: 'w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
        }, 'Add to Wishlist')
      )
    ),
    loading ? 
      React.createElement('p', null, 'Loading wishlist...') :
      items.length === 0 ?
        React.createElement('p', null, 'No items in wishlist yet!') :
        React.createElement('div', { className: 'space-y-4' },
          items.map(item => 
            React.createElement(WishlistItem, {
              key: item.id,
              item: item,
              onContribute: fetchWishlistItems
            })
          )
        )
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));