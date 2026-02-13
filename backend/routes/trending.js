
const express = require('express');
const axios = require('axios');

const router = express.Router();

// GET /api/trending
router.get('/', async (req, res) => {
  try {
    // Trending: most starred repos created in the last 7 days
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const q = `created:>${lastWeek}`;
    const url = `https://api.github.com/search/repositories`;
    const { data } = await axios.get(url, {
      params: { q, sort: 'stars', order: 'desc', per_page: 5 },
    });
    res.json(data.items.map(repo => ({
      name: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      url: repo.html_url,
      language: repo.language,
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending repositories.' });
  }
});

module.exports = router;
