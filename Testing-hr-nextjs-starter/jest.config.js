// Setup instructions: https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Stop running tests after the first failure
  bail: false,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Minimum percentage of test coverage required
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 92,
      lines: 95,
      statements: 95,
    },
  },

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/setupTests.js',
    '<rootDir>/config/umd_configs/',
  ],

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['json', 'text', 'text-summary', 'lcov', 'clover'],

  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],

  moduleNameMapper: {
    '@hackerrank/hrds-components': '@hackerrank/hrds-components/dist/index',
  },

  modulePathIgnorePatterns: [
    '<rootDir>/.actions/', // don't run tests inside GitHub Actions
  ],

  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/src/tests/setupTests.ts'], // jest matchers from testing-library
  testEnvironment: 'jest-environment-jsdom',

  // Activates notifications for test results
  notify: true,

  // An enum that specifies notification mode. Requires { notify: true }
  notifyMode: 'always',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/src/**/*.test.ts?(x)'],

  // Indicates whether each individual test should be reported during the run
  verbose: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
