// cart.js

window.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveAndRender() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
  }

  function renderCartItems() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    let grandTotal = 0;

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "cart-item";

      const totalPrice = item.price * item.quantity;
      grandTotal += totalPrice;

      div.innerHTML = `
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>₹${item.price} × ${item.quantity} = ₹${totalPrice}</p>
          <div class="quantity-controls">
            <button class="qty-btn decrease" data-index="${index}">➖</button>
            <button class="qty-btn increase" data-index="${index}">➕</button>
          </div>
        </div>
        <button class="remove-btn" data-index="${index}" title="Remove">🗑️</button>
      `;

      cartItemsContainer.appendChild(div);
    });

    const totalDiv = document.createElement("div");
    totalDiv.className = "cart-total";
    totalDiv.innerHTML = `<h3>Grand Total: ₹${grandTotal}</h3>`;
    cartItemsContainer.appendChild(totalDiv);

    document.querySelectorAll(".remove-btn").forEach(button => {
      button.addEventListener("click", () => {
        const index = button.getAttribute("data-index");
        cart.splice(index, 1);
        saveAndRender();
      });
    });

    document.querySelectorAll(".qty-btn.decrease").forEach(button => {
      button.addEventListener("click", () => {
        const index = button.getAttribute("data-index");
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        saveAndRender();
      });
    });

    document.querySelectorAll(".qty-btn.increase").forEach(button => {
      button.addEventListener("click", () => {
        const index = button.getAttribute("data-index");
        cart[index].quantity += 1;
        saveAndRender();
      });
    });
  }

  renderCartItems();
});
