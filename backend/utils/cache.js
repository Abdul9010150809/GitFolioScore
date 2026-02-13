
// Simple in-memory cache for API responses
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCache(key, value) {
  cache.set(key, { value, expiry: Date.now() + CACHE_TTL });
}

module.exports = {
  getCache,
  setCache
};
