const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Route to serve index.html (default home page)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Endpoint to receive and save orders
app.post('/submit-order', (req, res) => {
  const newOrder = req.body;
  const ordersFile = path.join(__dirname, 'orders.json');

  fs.readFile(ordersFile, 'utf8', (err, data) => {
    let orders = [];
    if (!err && data) {
      try {
        orders = JSON.parse(data);
      } catch (e) {
        console.error("Error parsing orders:", e);
        orders = [];
      }
    }

    orders.push(newOrder);

    fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), err => {
      if (err) {
        console.error("Error writing order:", err);
        return res.status(500).json({ message: 'Error saving order' });
      }
      console.log("✅ New order saved.");
      res.status(200).json({ message: 'Order saved successfully' });
    });
  });
});

// ✅ Endpoint to read all orders (for admin)
app.get('/orders', (req, res) => {
  const ordersFile = path.join(__dirname, 'orders.json');

  fs.readFile(ordersFile, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading orders:", err);
      return res.status(500).json({ message: 'Error loading orders' });
    }
    res.json(JSON.parse(data || '[]'));
  });
});

// ✅ Endpoint to delete an order by index
app.delete('/delete-order/:index', (req, res) => {
  const ordersFile = path.join(__dirname, 'orders.json');
  const indexToDelete = parseInt(req.params.index);

  fs.readFile(ordersFile, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading for delete:", err);
      return res.status(500).json({ message: 'Error reading orders' });
    }

    let orders = JSON.parse(data || '[]');

    if (indexToDelete >= 0 && indexToDelete < orders.length) {
      orders.splice(indexToDelete, 1);
      fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), err => {
        if (err) {
          console.error("Error deleting order:", err);
          return res.status(500).json({ message: 'Error deleting order' });
        }
        console.log(`🗑️ Order at index ${indexToDelete} deleted`);
        res.json({ message: 'Order deleted successfully' });
      });
    } else {
      res.status(400).json({ message: 'Invalid index' });
    }
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

