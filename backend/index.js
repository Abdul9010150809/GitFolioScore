const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const analyzeRouter = require('./routes/analyze');
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
app.use('/api/trending', trendingRouter);
app.use('/api/email', emailRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/score-history', scoreHistoryRouter);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(frontendBuildPath));

  // SPA fallback — serve index.html for all non-API routes
  app.get('*', (req, res) => {
    const indexPath = path.join(frontendBuildPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(404).json({ error: 'Not found' });
      }
    });
  });
} else {
  app.get('/', (req, res) => {
    res.send('GitFolioScore Backend API is running. Use /api/analyze/:username to analyze.');
  });
}

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 GitFolioScore server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
