window.addEventListener("DOMContentLoaded", () => {
    const cartButtons = document.querySelectorAll(".add-to-cart");
  
    cartButtons.forEach(button => {
      button.addEventListener("click", () => {
        const guitarName = button.getAttribute("data-name");
        const guitarPrice = parseFloat(button.getAttribute("data-price")); // 🔥 NEW
  
        if (!guitarName || isNaN(guitarPrice)) return;
  
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
        const existing = cart.find(item => item.name === guitarName);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ name: guitarName, price: guitarPrice, quantity: 1 }); // 🔥 NOW INCLUDES PRICE
        }
  
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`✅ ${guitarName} added to cart!`);
      });
    });
  });
  