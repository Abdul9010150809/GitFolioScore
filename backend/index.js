const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const analyzeRouter = require('./routes/analyze');
const githubAuthRouter = require('./auth/github');
const trendingRouter = require('./routes/trending');
const emailRouter = require('./routes/email');
const leaderboardRouter = require('./routes/leaderboard');
const scoreHistoryRouter = require('./routes/score-history');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/analyze', analyzeRouter);
app.use('/auth/github', githubAuthRouter);
app.use('/api/trending', trendingRouter);
app.use('/api/email', emailRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/score-history', scoreHistoryRouter);

// Serve frontend static files in production
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendBuildPath));

// Root API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'GitFolioScore API is running',
    version: '1.0.0',
    endpoints: [
      '/api/analyze/:username',
      '/api/trending',
      '/api/email/review',
      '/api/leaderboard',
      '/api/score-history/:username',
    ],
  });
});

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(frontendBuildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Not found' });
    }
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 GitFolioScore server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
