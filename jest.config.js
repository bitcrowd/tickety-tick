// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx}'],
  globals: {
    COMMITHASH: 'test-commit-hash',
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '(?!^.+\\.jsx?$)': '<rootDir>/test/transforms/file.js',
  },
  transformIgnorePatterns: ['node_modules/(?!ky)'],
};
