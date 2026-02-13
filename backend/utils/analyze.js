const axios = require('axios');

const GITHUB_API = 'https://api.github.com';
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

async function analyzeGitHubProfile(username, type = 'user', weights) {
  // Fetch profile (user or org)
  let profileRes;
  if (type === 'org') {
    profileRes = await axios.get(`${GITHUB_API}/orgs/${username}`);
  } else {
    profileRes = await axios.get(`${GITHUB_API}/users/${username}`);
  }
  const profile = profileRes.data;

  // Fetch repos (user or org)
  let repos = [];
  let page = 1;
  while (true) {
    const repoRes = await axios.get(`${GITHUB_API}/${type === 'org' ? 'orgs' : 'users'}/${username}/repos`, {
      params: { per_page: 100, page },
    });
    if (repoRes.data.length === 0) break;
    repos = repos.concat(repoRes.data);
    page++;
  }

  // Fetch README presence for each repo
  const readmeChecks = await Promise.all(
    repos.map(async (repo) => {
      try {
        await axios.get(`${GITHUB_API}/repos/${username}/${repo.name}/readme`);
        return true;
      } catch {
        return false;
      }
    })
  );

  // Analytics
  const now = Date.now();
  let totalStars = 0, totalForks = 0;
  const languageCount = {};
  let readmeCount = 0;
  let inactiveRepos = 0;
  const repoStats = repos.map((repo, i) => {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    if (repo.language) languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    if (readmeChecks[i]) readmeCount++;
    if (new Date(repo.updated_at).getTime() < now - SIX_MONTHS_MS) inactiveRepos++;
    return {
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      topics: repo.topics,
      updated_at: repo.updated_at,
      created_at: repo.created_at,
      hasReadme: readmeChecks[i],
    };
  });


  // Top 5 repos by stars/forks
  const topRepos = [...repoStats]
    .sort((a, b) => (b.stars + b.forks) - (a.stars + a.forks))
    .slice(0, 5);

  // Fetch commit activity, issues, PRs, contributors for top repos
  const commitActivity = {};
  const repoInsights = {};
  await Promise.all(topRepos.map(async (repo) => {
    try {
      const [commitRes, issuesRes, prsRes, contribRes] = await Promise.all([
        axios.get(`${GITHUB_API}/repos/${username}/${repo.name}/stats/commit_activity`),
        axios.get(`${GITHUB_API}/repos/${username}/${repo.name}/issues`, { params: { state: 'open', per_page: 5 } }),
        axios.get(`${GITHUB_API}/repos/${username}/${repo.name}/pulls`, { params: { state: 'open', per_page: 5 } }),
        axios.get(`${GITHUB_API}/repos/${username}/${repo.name}/contributors`, { params: { per_page: 5 } })
      ]);
      commitActivity[repo.name] = commitRes.data;
      repoInsights[repo.name] = {
        issues: issuesRes.data.map(i => ({ number: i.number, title: i.title, url: i.html_url })),
        prs: prsRes.data.map(p => ({ number: p.number, title: p.title, url: p.html_url })),
        contributors: contribRes.data.map(c => ({ login: c.login, url: c.html_url, avatar_url: c.avatar_url }))
      };
    } catch {
      commitActivity[repo.name] = [];
      repoInsights[repo.name] = { issues: [], prs: [], contributors: [] };
    }
  }));

  // Most used languages
  const mostUsedLanguages = Object.entries(languageCount)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({ lang, count }));

  // Scoring
  const scoreBreakdown = computeScore({
    profile,
    repos: repoStats,
    totalStars,
    totalForks,
    languageCount,
    readmeCount,
    inactiveRepos,
    weights
  });
  const score = Object.values(scoreBreakdown).reduce((a, b) => a + b, 0);

  // Insights
  const { strengths, redFlags, suggestions } = generateInsights({
    profile,
    repos: repoStats,
    totalStars,
    totalForks,
    languageCount,
    readmeCount,
    inactiveRepos,
  });

  return {
    score,
    scoreBreakdown,
    strengths,
    redFlags,
    suggestions,
    repoStats,
    topRepos,
    mostUsedLanguages,
    commitActivity, // { repoName: [ { total, week, days }, ... ] }
    repoInsights,   // { repoName: { issues, prs, contributors } }
    profile: {
      name: profile.name,
      login: profile.login,
      bio: profile.bio,
      followers: profile.followers,
      following: profile.following,
      public_repos: profile.public_repos,
      avatar_url: profile.avatar_url,
      location: profile.location,
      company: profile.company,
      created_at: profile.created_at,
      hireable: profile.hireable,
      email: profile.email,
      blog: profile.blog,
      twitter_username: profile.twitter_username,
      html_url: profile.html_url,
    },
  };
}

function computeScore({ profile, repos, totalStars, totalForks, languageCount, readmeCount, inactiveRepos, weights }) {
  // Default weights
  const w = {
    profile: 15,
    repoQuality: 25,
    activity: 20,
    impact: 20,
    diversity: 10,
    docs: 10,
    ...(weights || {})
  };
  // Profile completeness
  let profileScore = 0;
  if (profile.bio) profileScore += w.profile * 0.2;
  if (profile.avatar_url) profileScore += w.profile * 0.2;
  if (profile.location) profileScore += w.profile * 0.2;
  if (profile.company) profileScore += w.profile * 0.2;
  if (profile.public_repos >= 3) profileScore += w.profile * 0.2;

  // Repo quality
  let repoQuality = 0;
  const withDesc = repos.filter(r => r.description).length;
  const withTopics = repos.filter(r => r.topics && r.topics.length > 0).length;
  repoQuality += Math.min(w.repoQuality * 0.4, (withDesc / repos.length) * w.repoQuality * 0.4);
  repoQuality += Math.min(w.repoQuality * 0.4, (withTopics / repos.length) * w.repoQuality * 0.4);
  repoQuality += Math.min(w.repoQuality * 0.2, (readmeCount / repos.length) * w.repoQuality * 0.2);

  // Activity consistency
  let activity = 0;
  const activeRepos = repos.length - inactiveRepos;
  activity += Math.min(w.activity, (activeRepos / repos.length) * w.activity);

  // Project impact
  let impact = 0;
  impact += Math.min(w.impact * 0.5, totalStars / 50 * w.impact * 0.5);
  impact += Math.min(w.impact * 0.5, totalForks / 20 * w.impact * 0.5);

  // Language diversity
  let diversity = 0;
  diversity += Math.min(w.diversity, Object.keys(languageCount).length * 2);

  // README + docs
  let docs = 0;
  docs += Math.min(w.docs, (readmeCount / repos.length) * w.docs);

  return {
    profile: Math.round(profileScore),
    repoQuality: Math.round(repoQuality),
    activity: Math.round(activity),
    impact: Math.round(impact),
    diversity: Math.round(diversity),
    docs: Math.round(docs),
  };
}

function generateInsights({ profile, repos, totalStars, totalForks, languageCount, readmeCount, inactiveRepos }) {
  const strengths = [];
  const redFlags = [];
  const suggestions = [];

  // Strengths
  if (profile.bio) strengths.push('Profile bio is set');
  if (profile.avatar_url) strengths.push('Profile avatar present');
  if (profile.location) strengths.push('Location specified');
  if (profile.company) strengths.push('Company specified');
  if (profile.public_repos >= 3) strengths.push('Good number of public repos');
  if (Object.keys(languageCount).length >= 3) strengths.push('Diverse language usage');
  if (totalStars > 20) strengths.push('Projects have received stars');
  if (totalForks > 5) strengths.push('Projects have been forked');

  // Red Flags
  if (readmeCount < repos.length / 2) redFlags.push('Many repos missing README');
  if (inactiveRepos > repos.length / 2) redFlags.push('Many repos inactive');
  if (repos.filter(r => !r.description).length > repos.length / 2) redFlags.push('Many repos missing descriptions');
  if (repos.filter(r => !r.topics || r.topics.length === 0).length > repos.length / 2) redFlags.push('Many repos missing topics');

  // Suggestions
  if (!profile.bio) suggestions.push('Add a bio to your profile');
  if (!profile.avatar_url) suggestions.push('Add a profile picture');
  if (!profile.location) suggestions.push('Specify your location');
  if (!profile.company) suggestions.push('Add your company or organization');
  if (readmeCount < repos.length) suggestions.push('Add README files to all repos');
  if (inactiveRepos > 0) suggestions.push('Update inactive repositories');
  if (Object.keys(languageCount).length < 3) suggestions.push('Try using more programming languages');
  if (repos.filter(r => !r.description).length > 0) suggestions.push('Add descriptions to all repositories');
  if (repos.filter(r => !r.topics || r.topics.length === 0).length > 0) suggestions.push('Add topics to all repositories');


  return { strengths, redFlags, suggestions };
}

module.exports = {
  analyzeGitHubProfile,
  GITHUB_API
};
