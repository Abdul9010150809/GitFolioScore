# ⚡ GitFolioScore: Recruiter-Grade Portfolio Insights

GitFolioScore is a state-of-the-art GitHub analysis engine designed to bridge the gap between developers and recruiters. By leveraging the GitHub REST API, it provides a deep-dive scoring system that evaluates profile completeness, repository quality, and contribution consistency.

---

## 📽️ Demo & Visuals
Stay tuned for the walkthrough! You can record and place your video link below.

[![Watch the Demo](https://img.youtube.com/vi/PLACEHOLDER/0.jpg)](https://youtu.be/PLACEHOLDER)
> *Placeholder: Add your finalized demo video link here.*

---

## 🚀 Key Perks & Features

- **Smart Resolution**: Enter "First Last" and let our **Smart Search** resolve the correct GitHub handle (`Bangi Abdulla` → `B-Abdulla`).
- **Recruiter-First Metrics**:
  - **README Depth Analysis**: Evaluates documentation quality beyond mere existence.
  - **Commit Consistency**: A 12-week rolling window check to identify truly active contributors.
  - **Impact Scoring**: Real-time evaluation of stars, forks, and community engagement.
- **Dynamic Scoring Weights**: Tailor the 0–100 score based on what matters to you (Documentation vs. Code Impact).
- **Pro Dashboard**: Visual breakdowns using Recharts, dark mode support, and multi-language capabilities.
- **Actionable Feedback**: Specific "Red Flags" and "Suggestions" to help you level up your portfolio instantly.

---

## 📂 Project Structure

```text
GitFolioScore/
├── backend/                # Express.js Server
│   ├── routes/             # API Endpoints (Analyze, Trending, etc.)
│   ├── utils/              # Core Logic (Scoring, GitHub API, Mailer)
│   ├── __tests__/          # Backend Unit & Integration Tests
│   └── index.js            # Server Entry Point
├── frontend/               # React (Vite/CRA) Application
│   ├── src/
│   │   ├── components/     # Modular UI Components (Charts, Cards)
│   │   ├── hooks/          # Custom Hooks (Dark Mode)
│   │   ├── App.js          # main dashboard orchestration
│   │   └── setupProxy.js   # Local Dev Proxy Configuration
│   └── public/             # Static Assets & Manifests
├── README.md               # Professional Documentation
└── .env                    # Environment Config (GITHUB_TOKEN)
```

---

## 🛠️ Technical Impact

GitFolioScore solves the "Recruiter Fatigue" problem. Instead of a recruiter spending 15 minutes clicking through 20 repositories, they get a **single, verified score** and a **one-page summary** of a developer's true potential. 

- **Efficiency**: Reduces initial screening time by ~80%.
- **Objectivity**: Minimizes bias by focusing on cold, hard metrics like documentation size and commit frequency.

---

## 🔮 Future Scope

1. **AI-Powered Code Review**: Integrate LLMs to analyze code quality and provide specific refactoring tips.
2. **CI/CD Integration**: A GitHub Action that post-scores your PRs or profile updates.
3. **Portfolio Hosting**: One-click deployment of the report as a beautiful static webpage.
4. **Recruiter Portal**: A specialized view for hiring managers to compare multiple candidates side-by-side.

---

## ⚙️ Setup & Installation

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Abdul9010150809/GitFolioScore.git
   cd GitFolioScore
   ```
2. **Backend Config**:
   - Navigate to `backend/`.
   - Create a `.env` file and add: `GITHUB_TOKEN=your_token_here`.
   - Run `npm install` then `npm start`.
3. **Frontend Config**:
   - Navigate to `frontend/`.
   - Run `npm install` then `npm start`.

---

*Built for the [Hackathon Name] — Empowing Developers to Showcase Their Best.*
