
const request = require('supertest');
const app = require('../index');

describe('GET /api/score-history/:username', () => {
  it('returns score history for a known user', async () => {
    const res = await request(app).get('/api/score-history/octocat');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('date');
    expect(res.body[0]).toHaveProperty('score');
  });
  it('returns empty array for unknown user', async () => {
    const res = await request(app).get('/api/score-history/unknownuser');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
