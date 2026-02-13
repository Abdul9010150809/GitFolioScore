
const express = require('express');
const { sendPortfolioReviewEmail } = require('../utils/mailer');

const router = express.Router();

// POST /api/email/review
router.post('/review', async (req, res) => {
  const { to, subject, html } = req.body;
  if (!to || !subject || !html) return res.status(400).json({ error: 'Missing fields' });
  try {
    await sendPortfolioReviewEmail(to, subject, html);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
