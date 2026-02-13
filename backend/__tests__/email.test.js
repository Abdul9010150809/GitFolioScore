
const request = require('supertest');
const express = require('express');
jest.mock('../utils/mailer.js', () => ({
  sendPortfolioReviewEmail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
}));
const emailRouter = require('../routes/email.js');
const app = express();
app.use(express.json());
app.use('/api/email', emailRouter);

describe('POST /api/email/review', () => {
  it('returns 400 if missing fields', async () => {
    const res = await request(app).post('/api/email/review').send({});
    expect(res.status).toBe(400);
  });
  
  it('returns 200 with valid fields', async () => {
    const res = await request(app)
      .post('/api/email/review')
      .send({ to: 'test@example.com', subject: 'Test', html: '<p>Test</p>' });
    expect(res.status).toBe(200);
  });
});
