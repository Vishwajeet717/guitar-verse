const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// ✅ Serve static files from the frontend folder
const frontendPath = "D:/HTML CSS/PROJECT";  // <- update if your path changes
app.use(express.static(frontendPath));

// ✅ Parse JSON and form data from the frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Route to serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ✅ Route to serve admin.html
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(frontendPath, 'admin.html'));
});

// ✅ POST: Receive order and save it to orders.json
app.post('/submit-order', (req, res) => {
  const newOrder = req.body;
  const ordersFile = path.join(__dirname, 'orders.json');

  fs.readFile(ordersFile, 'utf8', (err, data) => {
    let orders = [];
    if (!err && data) {
      try {
        orders = JSON.parse(data);
      } catch (e) {
        orders = [];
      }
    }

    orders.push(newOrder);

    fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), err => {
      if (err) return res.status(500).json({ message: '❌ Error saving order' });
      res.status(200).json({ message: '✅ Order saved successfully' });
    });
  });
});

// ✅ GET: Read and return all orders for admin
app.get('/orders', (req, res) => {
  const ordersFile = path.join(__dirname, 'orders.json');

  fs.readFile(ordersFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: '❌ Error loading orders' });
    try {
      const orders = JSON.parse(data || '[]');
      res.json(orders);
    } catch {
      res.json([]);
    }
  });
});

// ✅ DELETE: Delete an order by index
app.delete('/delete-order/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const ordersFile = path.join(__dirname, 'orders.json');

  fs.readFile(ordersFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: '❌ Error reading orders' });

    let orders = JSON.parse(data || '[]');
    if (index < 0 || index >= orders.length) {
      return res.status(400).json({ message: 'Invalid order index' });
    }

    orders.splice(index, 1); // remove the order

    fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), err => {
      if (err) return res.status(500).json({ message: '❌ Error deleting order' });
      res.json({ message: '🗑️ Order deleted successfully' });
    });
  });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
