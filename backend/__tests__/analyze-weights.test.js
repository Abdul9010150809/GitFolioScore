const request = require('supertest');
const app = require('../index');

describe('GET /api/analyze/:username with custom weights', () => {
  it('applies custom weights and returns a score breakdown reflecting them', async () => {
    const weights = {
      profile: 50,
      repoQuality: 10,
      activity: 10,
      impact: 10,
      diversity: 10,
      docs: 10
    };
    const res = await request(app)
      .get('/api/analyze/octocat')
      .query({ weights: JSON.stringify(weights) });
    expect(res.status).toBe(200);
    expect(res.body.scoreBreakdown).toBeDefined();
    expect(res.body.scoreBreakdown.profile).toBeGreaterThan(10); // Should reflect higher weight
    expect(res.body.scoreBreakdown.repoQuality).toBeLessThan(20); // Should reflect lower weight
  });
});
