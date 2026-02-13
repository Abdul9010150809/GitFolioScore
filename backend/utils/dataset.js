const fs = require('fs');
const path = require('path');

/**
 * Parses the awesome-list readme.md to extract GitHub repo references.
 * Returns an array of { owner, repo, description, category } objects.
 */
function parseAwesomeList() {
    const readmePath = path.join(__dirname, '..', '..', 'dataset', 'extracted', 'readme.md');

    if (!fs.existsSync(readmePath)) {
        console.warn('Dataset readme.md not found at', readmePath);
        return [];
    }

    const content = fs.readFileSync(readmePath, 'utf-8');
    const lines = content.split('\n');

    const repos = [];
    let currentCategory = '';

    // Match GitHub repo links: [text](https://github.com/owner/repo...)
    const ghRegex = /\[([^\]]+)\]\(https:\/\/github\.com\/([^\/\s#)]+)\/([^\/\s#)]+?)(?:#[^)]*)?\)/g;

    for (const line of lines) {
        // Track categories (## headers)
        const headerMatch = line.match(/^##\s+(.+)/);
        if (headerMatch) {
            currentCategory = headerMatch[1].trim();
            continue;
        }

        let match;
        while ((match = ghRegex.exec(line)) !== null) {
            const [, description, owner, repo] = match;
            repos.push({
                owner,
                repo: repo.replace(/^awesome-/, ''),
                fullRepo: `${owner}/${repo}`,
                description: description.trim(),
                category: currentCategory,
            });
        }
        // Reset lastIndex for the next line
        ghRegex.lastIndex = 0;
    }

    return repos;
}

/**
 * Returns a curated set of notable GitHub profile owners from the dataset
 * for use in the leaderboard benchmark feature.
 */
function getBenchmarkProfiles() {
    const repos = parseAwesomeList();

    // Count how many awesome-list entries each owner has
    const ownerCounts = {};
    for (const r of repos) {
        ownerCounts[r.owner] = (ownerCounts[r.owner] || 0) + 1;
    }

    // Sort by count and take top profiles
    const topOwners = Object.entries(ownerCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([owner, count]) => ({
            username: owner,
            awesomeListCount: count,
            category: repos.find(r => r.owner === owner)?.category || 'General',
        }));

    return topOwners;
}

/**
 * Returns unique categories from the dataset.
 */
function getCategories() {
    const repos = parseAwesomeList();
    return [...new Set(repos.map(r => r.category).filter(Boolean))];
}

module.exports = {
    parseAwesomeList,
    getBenchmarkProfiles,
    getCategories,
};
