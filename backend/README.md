# GitFolioScore Backend

This is the backend API for GitFolioScore, a GitHub Portfolio Analyzer & Enhancer.

## Features
- API route: `GET /api/analyze/:username`
- Fetches GitHub profile and repository data
- Computes analytics: stars, forks, languages, top repos, inactive repos
- Calculates a portfolio score (0–100) with detailed breakdown
- Generates strengths, red flags, and suggestions
- Handles errors for invalid usernames and API rate limits

## Tech Stack
- Node.js
- Express
- Axios
- dotenv

## Setup Instructions
1. `cd backend`
2. `npm install`
3. Create a `.env` file and add your GitHub personal access token (optional, for higher rate limits):
   ```
   GITHUB_TOKEN=your_token_here
   ```
4. `npm start` (or `npm run dev` for development)

## API Usage
- `GET /api/analyze/:username`
- Returns JSON with score, breakdown, strengths, redFlags, suggestions, repoStats, topRepos, mostUsedLanguages, and profile info.

## Scoring Logic
- Profile completeness (15)
- Repo quality (25)
- Activity consistency (20)
- Project impact (stars/forks) (20)
- Language diversity (10)
- README + documentation (10)

## Example Response
```json
{
  "score": 78,
  "scoreBreakdown": { "profile": 12, "repoQuality": 20, ... },
  "strengths": ["Profile bio is set", ...],
  "redFlags": ["Many repos missing README"],
  "suggestions": ["Add README files to all repos"],
  "repoStats": [...],
  "topRepos": [...],
  "mostUsedLanguages": [...],
  "profile": { "name": "...", ... }
}
```
