function initRoundUpModal() {
  // Listen for cart updates
  document.addEventListener('cart:updated', (event) => {
    const cartTotal = parseFloat(document.querySelector('[data-cart-total]').getAttribute('data-cart-total')) / 100;
    const roundUpAmount = Math.ceil(cartTotal) - cartTotal;
    
    if (roundUpAmount > 0) {
      showRoundUpModal(cartTotal, roundUpAmount);
    }
  });
}

function showRoundUpModal(cartTotal, roundUpAmount) {
  const modalHtml = `
    <div id="roundUpModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Round Up & Contribute</h2>
        <p class="mb-4">
          Would you like to round up your purchase of $${cartTotal.toFixed(2)} to $${Math.ceil(cartTotal).toFixed(2)} and 
          contribute $${roundUpAmount.toFixed(2)} to someone's wish?
        </p>
        <div class="flex justify-end space-x-4">
          <button onclick="closeRoundUpModal()" class="px-4 py-2 text-gray-600">No, thanks</button>
          <button onclick="handleRoundUpContribute(${roundUpAmount})" class="px-4 py-2 bg-blue-500 text-white rounded">
            Yes, contribute
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}