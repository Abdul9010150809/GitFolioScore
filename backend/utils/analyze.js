const axios = require('axios');

const GITHUB_API = 'https://api.github.com';
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

async function analyzeGitHubProfile(input, type = 'user', weights) {
  const isRepo = input.includes('/');
  let profile, repos = [];
  let username = input;

  // Handle names with spaces (search for user)
  if (!isRepo && input.includes(' ')) {
    try {
      const searchRes = await axios.get(`${GITHUB_API}/search/users`, {
        params: { q: input, per_page: 1 },
        headers: process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}
      });
      if (searchRes.data.items && searchRes.data.items.length > 0) {
        username = searchRes.data.items[0].login;
      } else {
        throw new Error('User not found via search');
      }
    } catch (err) {
      throw new Error('User search failed');
    }
  }

  if (isRepo) {
    // Analyze specific repository
    const [owner, repoName] = input.split('/');
    try {
      const repoRes = await axios.get(`${GITHUB_API}/repos/${owner}/${repoName}`, {
        headers: process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}
      });
      const repo = repoRes.data;

      // Fetch owner profile for context
      const profileRes = await axios.get(`${GITHUB_API}/users/${owner}`, {
        headers: process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}
      });
      profile = profileRes.data;

      // Use the single repo as the list
      repos = [repo];
    } catch (err) {
      throw new Error('Repository not found');
    }
  } else {
    // Analyze user or organization
    let profileRes;
    const authHeaders = process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {};
    if (type === 'org') {
      profileRes = await axios.get(`${GITHUB_API}/orgs/${username}`, { headers: authHeaders });
    } else {
      profileRes = await axios.get(`${GITHUB_API}/users/${username}`, { headers: authHeaders });
    }
    profile = profileRes.data;

    // Fetch repos (user or org)
    let page = 1;
    while (true) {
      const endpoint = type === 'org' ? `orgs/${username}/repos` : `users/${username}/repos`;
      const repoRes = await axios.get(`${GITHUB_API}/${endpoint}`, {
        params: { per_page: 100, page },
        headers: authHeaders
      });
      if (repoRes.data.length === 0) break;
      repos = repos.concat(repoRes.data);
      page++;
      if (page > 3) break; // Limit to 300 repos for performance
    }
  }

  // Fetch README presence and size
  const readmeChecks = await Promise.all(
    repos.map(async (repo) => {
      try {
        const r = await axios.get(`${GITHUB_API}/repos/${repo.full_name}/readme`);
        return { exists: true, size: r.data.size };
      } catch {
        return { exists: false, size: 0 };
      }
    })
  );

  // Analytics
  const now = Date.now();
  let totalStars = 0, totalForks = 0;
  const languageCount = {};
  let readmeCount = 0;
  let detailedReadmeCount = 0;
  let inactiveRepos = 0;

  const repoStats = repos.map((repo, i) => {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    if (repo.language) languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    if (readmeChecks[i].exists) {
      readmeCount++;
      if (readmeChecks[i].size > 1000) detailedReadmeCount++;
    }
    if (new Date(repo.updated_at).getTime() < now - SIX_MONTHS_MS) inactiveRepos++;
    return {
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      topics: repo.topics,
      updated_at: repo.updated_at,
      created_at: repo.created_at,
      hasReadme: readmeChecks[i].exists,
      readmeSize: readmeChecks[i].size
    };
  });

  // Top 5 repos (or just the 1 if repo analysis)
  const topRepos = [...repoStats]
    .sort((a, b) => (b.stars + b.forks) - (a.stars + a.forks))
    .slice(0, 5);

  // Fetch commit activity...
  const commitActivity = {};
  const repoInsights = {};
  let consistentReposCount = 0;

  await Promise.all(topRepos.map(async (repo) => {
    const owner = isRepo ? input.split('/')[0] : input;
    const name = repo.name;
    try {
      const [commitRes, issuesRes, prsRes, contribRes] = await Promise.all([
        axios.get(`${GITHUB_API}/repos/${repo.full_name}/stats/commit_activity`),
        axios.get(`${GITHUB_API}/repos/${repo.full_name}/issues`, { params: { state: 'open', per_page: 5 } }),
        axios.get(`${GITHUB_API}/repos/${repo.full_name}/pulls`, { params: { state: 'open', per_page: 5 } }),
        axios.get(`${GITHUB_API}/repos/${repo.full_name}/contributors`, { params: { per_page: 5 } })
      ]);
      commitActivity[name] = commitRes.data;

      // Analyze consistency (if data is array)
      if (Array.isArray(commitRes.data) && commitRes.data.length > 0) {
        // Check last 12 weeks for gaps
        const recentWeeks = commitRes.data.slice(-12);
        const activeWeeks = recentWeeks.filter(w => w.total > 0).length;
        // If active more than 50% of weeks, it's consistent
        if (activeWeeks >= 6) consistentReposCount++;
      }

      repoInsights[name] = {
        issues: issuesRes.data.map(i => ({ number: i.number, title: i.title, url: i.html_url })),
        prs: prsRes.data.map(p => ({ number: p.number, title: p.title, url: p.html_url })),
        contributors: contribRes.data.map(c => ({ login: c.login, url: c.html_url, avatar_url: c.avatar_url }))
      };
    } catch (e) {
      commitActivity[name] = [];
      repoInsights[name] = { issues: [], prs: [], contributors: [] };
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
    detailedReadmeCount,
    inactiveRepos,
    consistentReposCount,
    topReposCount: topRepos.length,
    weights,
    isRepo
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
    detailedReadmeCount,
    inactiveRepos,
    consistentReposCount,
    topReposCount: topRepos.length,
    isRepo
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
    commitActivity,
    repoInsights,
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

function computeScore({ profile, repos, totalStars, totalForks, languageCount, readmeCount, detailedReadmeCount, inactiveRepos, consistentReposCount, topReposCount, weights, isRepo }) {
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
  if (!isRepo) {
    if (profile.bio) profileScore += w.profile * 0.2;
    if (profile.avatar_url) profileScore += w.profile * 0.2;
    if (profile.location) profileScore += w.profile * 0.2;
    if (profile.company) profileScore += w.profile * 0.2;
    if (profile.public_repos >= 3) profileScore += w.profile * 0.2;
  } else {
    profileScore = w.profile;
  }

  // Repo quality
  let repoQuality = 0;
  const withDesc = repos.filter(r => r.description).length;
  const withTopics = repos.filter(r => r.topics && r.topics.length > 0).length;
  repoQuality += Math.min(w.repoQuality * 0.4, (withDesc / repos.length) * w.repoQuality * 0.4);
  repoQuality += Math.min(w.repoQuality * 0.4, (withTopics / repos.length) * w.repoQuality * 0.4);
  // Detailed README bonus in quality
  const detailedRatio = detailedReadmeCount / repos.length;
  repoQuality += Math.min(w.repoQuality * 0.2, detailedRatio * w.repoQuality * 0.2);

  // Activity consistency
  let activity = 0;
  const activeRepos = repos.length - inactiveRepos;
  activity += Math.min(w.activity * 0.6, (activeRepos / repos.length) * w.activity * 0.6);
  // Consistency bonus (based on weekly commits)
  if (topReposCount > 0) {
    activity += Math.min(w.activity * 0.4, (consistentReposCount / topReposCount) * w.activity * 0.4);
  }

  // Project impact
  let impact = 0;
  impact += Math.min(w.impact * 0.5, totalStars / (isRepo ? 10 : 50) * w.impact * 0.5);
  impact += Math.min(w.impact * 0.5, totalForks / (isRepo ? 5 : 20) * w.impact * 0.5);

  // Language diversity (Skip for single repo)
  let diversity = 0;
  if (!isRepo) {
    diversity += Math.min(w.diversity, Object.keys(languageCount).length * 2);
  } else {
    diversity = w.diversity;
  }

  // README + docs (Base existence score)
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

function generateInsights({ profile, repos, totalStars, totalForks, languageCount, readmeCount, detailedReadmeCount, inactiveRepos, consistentReposCount, topReposCount, isRepo }) {
  const strengths = [];
  const redFlags = [];
  const suggestions = [];

  // Strengths
  if (!isRepo) {
    if (profile.bio) strengths.push('Profile bio is set');
    if (profile.avatar_url) strengths.push('Profile avatar present');
    if (profile.location) strengths.push('Location specified');
    if (profile.company) strengths.push('Company specified');
    if (profile.public_repos >= 3) strengths.push('Good number of public repos');
    if (Object.keys(languageCount).length >= 3) strengths.push('Diverse language usage');
  } else {
    strengths.push('Analyzing specific repository');
  }

  if (totalStars > (isRepo ? 5 : 20)) strengths.push('Description has stars'); // Fixed typo
  if (totalStars > (isRepo ? 5 : 20)) strengths.push('Project has received stars');
  if (totalForks > (isRepo ? 2 : 5)) strengths.push('Project has been forked');
  if (detailedReadmeCount >= (isRepo ? 1 : 3)) strengths.push('Detailed documentation found');
  if (consistentReposCount >= (isRepo ? 1 : 2)) strengths.push('Consistent commit activity');

  // Red Flags
  if (readmeCount < repos.length / 2) redFlags.push('Many repositories missing README');
  if (detailedReadmeCount < repos.length / 4) redFlags.push('READMEs lack depth/detail'); // New Red Flag
  if (inactiveRepos > repos.length / 2) redFlags.push('High ratio of inactive repositories');
  if (topReposCount > 0 && consistentReposCount < topReposCount / 2) redFlags.push('Inconsistent commit activity'); // New Red Flag
  if (repos.filter(r => !r.description).length > 0) redFlags.push('Repositories missing description');

  // Suggestions
  if (!isRepo) {
    if (!profile.bio) suggestions.push('Add a bio to your profile');
    if (!profile.avatar_url) suggestions.push('Add a profile picture');
    if (!profile.location) suggestions.push('Specify your location');
    if (!profile.company) suggestions.push('Add your company or organization');
  }

  if (readmeCount < repos.length) suggestions.push('Add README to all repositories');
  if (detailedReadmeCount < repos.length / 2) suggestions.push('Expand READMEs with detailed project info'); // New Sugg
  if (inactiveRepos > 0) suggestions.push('Archive or update inactive repositories');
  if (topReposCount > 0 && consistentReposCount < topReposCount) suggestions.push('Commit more consistently to top projects'); // New Sugg
  if (!isRepo && Object.keys(languageCount).length < 3) suggestions.push('Try using more programming languages');
  if (repos.filter(r => !r.description).length > 0) suggestions.push('Add descriptions to all repositories');
  if (repos.filter(r => !r.topics || r.topics.length === 0).length > 0) suggestions.push('Add topics (tags) to repositories');


  return { strengths, redFlags, suggestions };
}

module.exports = {
  analyzeGitHubProfile,
  GITHUB_API
};
