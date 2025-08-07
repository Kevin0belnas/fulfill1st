// backend/routes/fulfillment.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all fulfillment transactions
router.get('/', (req, res) => {
  db.query('SELECT * FROM fulfillment', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Add a new fulfillment transaction
router.post('/', (req, res) => {
  const { order_id, item, quantity } = req.body;
  db.query('INSERT INTO fulfillment (order_id, item, quantity) VALUES (?, ?, ?)', [order_id, item, quantity], (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert error' });
    res.json({ id: result.insertId });
  });
});

module.exports = router;
