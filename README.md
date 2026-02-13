# GitFolioScore

GitFolioScore is a full-stack web app that analyzes and scores GitHub portfolios for developers, students, and job seekers. It provides actionable insights, strengths, red flags, and improvement suggestions in a clean, recruiter-style dashboard.

## Features
- Enter a GitHub username and analyze their portfolio
- Fetches profile and repository data using GitHub REST API
- Calculates a GitHub Portfolio Score (0–100) based on:
  - Profile completeness
  - Repo quality
  - Activity consistency
  - Project impact (stars/forks)
  - Language diversity
  - README/documentation
- Dashboard UI: score card, breakdown, strengths, red flags, suggestions, top repos, language chart
- Handles invalid usernames and API rate limits
- Responsive, modern UI (React + Tailwind CSS)

## Tech Stack
- Frontend: React, Tailwind CSS, Recharts, Axios
- Backend: Node.js, Express, Axios, dotenv

## Setup Instructions
1. Clone the repo and open the folder
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. (Optional) Add a `.env` file in `backend/` with your GitHub token for higher rate limits:
   ```
   GITHUB_TOKEN=your_token_here
   ```
4. Start the backend:
   ```bash
   npm start
   ```
5. In a new terminal, install frontend dependencies:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## API Endpoint
- `GET /api/analyze/:username`
- Returns JSON with score, breakdown, strengths, redFlags, suggestions, repoStats, topRepos, mostUsedLanguages, and profile info.

## Scoring Logic
- Profile completeness (15)
- Repo quality (25)
- Activity consistency (20)
- Project impact (20)
- Language diversity (10)
- README + documentation (10)

## Demo
_Add demo video or screenshots here_
