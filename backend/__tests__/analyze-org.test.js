const axios = require('axios');
const { analyzeGitHubProfile } = require('../utils/analyze.js');

jest.mock('axios');

describe('Organization Analysis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('analyzes a known organization (e.g. vercel)', async () => {
    axios.get.mockResolvedValueOnce({
      data: { name: 'Vercel', login: 'vercel', public_repos: 100 },
    });
    axios.get.mockResolvedValueOnce({
      data: [
        { name: 'repo1', stargazers_count: 1000, language: 'JavaScript', html_url: 'https://github.com/vercel/repo1' },
        { name: 'repo2', stargazers_count: 500, language: 'TypeScript', html_url: 'https://github.com/vercel/repo2' },
      ],
    });
    axios.get.mockResolvedValueOnce({
      data: { total_count: 2, items: [] },
    });
    axios.get.mockResolvedValueOnce({
      data: Array.from({ length: 52 }, (_, i) => ({ total: i * 10, week: 1000000 + i * 604800 })),
    });
    
    const report = await analyzeGitHubProfile('vercel', 'org');
    
    expect(report).toHaveProperty('score');
    expect(report).toHaveProperty('repoStats');
    expect(Array.isArray(report.repoStats)).toBe(true);
    expect(report.profile).toHaveProperty('name');
  }, 20000);
});
