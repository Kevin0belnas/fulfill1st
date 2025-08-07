const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyRecaptcha = require('../middleware/recaptcha');


router.post('/save-review', verifyRecaptcha, async (req, res) => {
  const { serviceId, section, name, email, text, rating } = req.body;

  if (!serviceId || !section || !name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // At least one of rating or text must be provided
  if (!rating && !text) {
    return res.status(400).json({ error: 'Please provide either a rating or review text' });
  }

  try {
    await db.query(
      `INSERT INTO reviews (service_id, section, name, email, text, rating, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [serviceId, section, name, email, text || null, rating || null]
    );

    res.json({ message: 'Feedback saved successfully' });
  } catch (error) {
    console.error('Error saving feedback:', error);

    // Check for duplicate entry
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'You have already submitted feedback for this service' });
    }

    res.status(500).json({ error: 'Database error saving feedback' });
  }
});

// Fetch all reviews for a service
router.get('/reviews', async (req, res) => {
  const { service, section } = req.query;

  if (!service || !section) {
    return res.status(400).json({ error: 'Missing query parameters' });
  }

  try {
    const [rows] = await db.query(
      `SELECT id, text, rating, created_at, author FROM reviews WHERE service_id = ? AND section = ? ORDER BY created_at DESC`,
      [service, section]
    );
    res.json({ reviews: rows });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Database error fetching reviews' });
  }
});
module.exports = router;