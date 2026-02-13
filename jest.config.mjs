// jest.config.mjs for ESM support in backend
export default {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js', 'mjs', 'json'],
  roots: ['<rootDir>/backend/__tests__'],
  testMatch: ['**/*.test.js', '**/*.test.mjs'],
};
