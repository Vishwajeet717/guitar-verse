fetch('/orders')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('orders-container');

    if (data.length === 0) {
      container.innerHTML = "<p style='text-align:center'>No orders yet.</p>";
    } else {
      data.forEach(order => {
        const div = document.createElement('div');
        div.classList.add('order-box');

        div.innerHTML = `
          <h3>${order.name}</h3>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Address:</strong> ${order.address}</p>
          <p><strong>Payment:</strong> ${order.payment}</p>
          <p><strong>Items:</strong> ${order.items.map(i => `${i.name} x${i.quantity || 1}`).join(', ')}</p>
        `;

        container.appendChild(div);
      });
    }
  })
  .catch(err => {
    console.error('Failed to load orders', err);
    alert('⚠️ Failed to load orders');
  });
