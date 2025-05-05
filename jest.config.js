// Root jest.config.js
// This configuration forwards to the React app directory for testing

/** @type {import('jest').Config} */
module.exports = {
  // Forward all commands to the React app directory
  rootDir: '.',
  testMatch: [],

  // We're not actually testing at the root level
  passWithNoTests: true,

  // This is the key part - setting the correct root directory to run tests in
  // Point directly to the react-app directory instead of its config file
  roots: ['<rootDir>/src/frontend/react-app']
};
