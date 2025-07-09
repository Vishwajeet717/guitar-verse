const ordersContainer = document.getElementById("orders");

fetch("/orders")
  .then(res => res.json())
  .then(data => {
    if (data.length === 0) {
      ordersContainer.innerHTML = "<p>No orders yet.</p>";
      return;
    }

    data.forEach((order, index) => {
      const div = document.createElement("div");
      div.classList.add("order");

      div.innerHTML = `
        <h3>Order ${index + 1}</h3>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Payment:</strong> ${order.payment}</p>
        <p><strong>Items:</strong></p>
        <ul>${order.cart.map(item => `<li>${item.name} × ${item.quantity}</li>`).join("")}</ul>
        <button onclick="deleteOrder(${index})">🗑️ Delete</button>
        <hr>
      `;

      ordersContainer.appendChild(div);
    });
  })
  .catch(err => {
    ordersContainer.innerHTML = "<p>Error loading orders</p>";
    console.error(err);
  });

function deleteOrder(index) {
  if (!confirm("Are you sure you want to delete this order?")) return;

  fetch(`/delete-order/${index}`, {
    method: "DELETE"
  })
    .then(res => {
      if (res.ok) {
        alert("✅ Order deleted!");
        location.reload();
      } else {
        alert("❌ Failed to delete order");
      }
    })
    .catch(() => alert("❌ Server error"));
}

