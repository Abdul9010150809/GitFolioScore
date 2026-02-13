const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const GITHUB_API = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = GITHUB_TOKEN
  ? { Authorization: `token ${GITHUB_TOKEN}` }
  : {};

async function githubGet(url, params = {}) {
  return axios.get(`${GITHUB_API}${url}`, {
    headers,
    params,
  });
}

module.exports = { githubGet, GITHUB_API, headers };
