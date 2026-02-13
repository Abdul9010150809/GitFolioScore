
const express = require('express');
const router = express.Router();

// In-memory mock for demo; replace with DB in production
const userHistory = {
  octocat: [
    { date: '2026-02-01', score: 80 },
    { date: '2026-02-05', score: 85 },
    { date: '2026-02-10', score: 90 },
    { date: '2026-02-13', score: 95 }
  ]
};

router.get('/:username', (req, res) => {
  const { username } = req.params;
  res.json(userHistory[username] || []);
});

module.exports = router;
