// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx}'],
  setupTestFrameworkScriptFile: '<rootDir>/test/setup.js',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.png$': '<rootDir>/test/transforms/file.js',
  },
};
