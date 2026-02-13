
const express = require('express');
const { analyzeGitHubProfile } = require('../utils/analyze');
const { getCache, setCache } = require('../utils/cache');

const router = express.Router();

router.get('/:username', async (req, res) => {
  const { username } = req.params;
  const { type, weights } = req.query; // type can be 'user' or 'org', weights is JSON string
  const cacheKey = `analyze:${type || 'user'}:${username}:${weights || ''}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  try {
    let parsedWeights = undefined;
    if (weights) {
      try { parsedWeights = JSON.parse(weights); } catch {}
    }
    const report = await analyzeGitHubProfile(username, type, parsedWeights);
    setCache(cacheKey, report);
    res.json(report);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'GitHub user/org not found.' });
    } else if (error.response && error.response.status === 403) {
      res.status(403).json({ error: 'GitHub API rate limit exceeded.' });
    } else {
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
});

module.exports = router;
