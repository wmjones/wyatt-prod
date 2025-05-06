/** @type {import('jest').Config} */
const config = {
  // Set test environment
  testEnvironment: 'jsdom',

  // Silence console warnings/logs during tests
  silent: true,

  // Specify test file patterns
  testMatch: [
    '**/__tests__/**/*.ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)'
  ],

  // Files to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/'
  ],

  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/setupTests.ts',
    '!src/test-utils/**',
    '!src/mocks/**',
    '!**/__mocks__/**',
    '!**/node_modules/**'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    },
    'src/components/': {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80
    },
    'src/utils/': {
      statements: 75,
      branches: 70,
      functions: 75,
      lines: 75
    }
  },

  // Coverage report directory
  coverageDirectory: '<rootDir>/coverage',

  // Module name mapper for imports
  moduleNameMapper: {
    // Handle CSS imports
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // Handle image imports
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',

    // Resolve path aliases
    '^src/(.*)$': '<rootDir>/src/$1',

    // Map specific modules that might cause issues
    'd3': '<rootDir>/node_modules/d3/dist/d3.min.js'
  },

  // Mock files
  moduleDirectories: [
    'node_modules',
    'src'
  ],

  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.js' }]
  },

  // Don't transform these modules - this allows ESM syntax to be transpiled in node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(d3|d3-array|d3-axis|d3-scale|d3-selection|d3-shape|d3-transition|internmap|@babel/runtime)/)'
  ],

  // Unmocked modules
  unmockedModulePathPatterns: [
    'node_modules/react/',
    'node_modules/enzyme/'
  ],

  // Allow for absolute imports from src
  rootDir: '.',
  roots: ['<rootDir>/src']
};

module.exports = config;
