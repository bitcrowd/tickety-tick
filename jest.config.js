// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: "coverage",
  collectCoverageFrom: ["<rootDir>/src/**/*.{js,jsx,ts,tsx}"],
  globals: {
    COMMITHASH: "test-commit-hash",
  },
  setupFilesAfterEnv: ["<rootDir>/test/setup.js"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  transform: {
    "^.+\\.(jsx?|tsx?)$": "babel-jest",
    "(?!^.+\\.(jsx?|tsx?)$)": "<rootDir>/test/transforms/file.js",
  },
  transformIgnorePatterns: ["node_modules/(?!ky)"],
};
