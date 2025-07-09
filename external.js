document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      alert("❌ Your cart is empty!");
      return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const address = document.getElementById("address").value.trim();
    const payment = document.querySelector('input[name="payment"]:checked')?.value;

    if (!name || !email || !phone || !pincode || !address || !payment) {
      alert("Please fill out all the required fields.");
      return;
    }

    // OPTIONAL: Send this to backend (if you set one)
    console.log("Order placed!", { name, email, phone, pincode, address, payment, cart });

    // Clear cart and redirect
    localStorage.removeItem("cart");
    alert("✅ Your order has been placed!");
    window.location.href = "thankyou.html";
  });
});
