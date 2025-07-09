const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000; // ✅ Use dynamic port

// ✅ Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Route to serve index.html (optional fallback)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Receive orders and save to orders.json
app.post('/submit-order', (req, res) => {
  const newOrder = req.body;
  const ordersFile = path.join(__dirname, 'orders.json');

  fs.readFile(ordersFile, 'utf8', (err, data) => {
    let orders = [];
    if (!err && data) {
      orders = JSON.parse(data);
    }

    orders.push(newOrder);

    fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), err => {
      if (err) {
        return res.status(500).json({ message: 'Error saving order' });
      }
      res.status(200).json({ message: 'Order saved successfully' });
    });
  });
});

// ✅ Provide orders to admin page
app.get('/orders', (req, res) => {
  const ordersFile = path.join(__dirname, 'orders.json');

  fs.readFile(ordersFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error loading orders' });
    }
    res.json(JSON.parse(data || '[]'));
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
