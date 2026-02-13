const request = require('supertest');
const axios = require('axios');
const app = require('../index');

jest.mock('axios');

describe('GET /api/analyze/:username with custom weights', () => {
  beforeEach(() => {
    axios.get.mockReset();
  });

  it('applies custom weights and returns a score breakdown reflecting them', async () => {
    // Mock profile response
    axios.get.mockImplementation((url) => {
      if (url.includes('/users/octocat')) {
        return Promise.resolve({
          data: {
            login: 'octocat',
            name: 'The Octocat',
            bio: 'Social coding',
            public_repos: 5,
            followers: 100,
            following: 5,
            avatar_url: 'http://.../avatar',
            location: 'San Francisco',
            company: 'GitHub'
          }
        });
      }
      if (url.includes('/repos')) {
        return Promise.resolve({
          data: Array(5).fill({
            name: 'repo',
            startgazers_count: 10,
            forks_count: 5,
            language: 'JavaScript',
            description: 'desc',
            topics: ['topic'],
            updated_at: new Date().toISOString()
          })
        });
      }
      return Promise.resolve({ data: {} });
    });

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
    // With mock profile having bio, location, company, avatar -> almost full profile score
    // 50 * 0.8 or something. Should be > 10.
    expect(res.body.scoreBreakdown.profile).toBeGreaterThan(10);
    expect(res.body.scoreBreakdown.repoQuality).toBeLessThan(20);
  });
});
