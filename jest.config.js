// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: "coverage",
  collectCoverageFrom: ["<rootDir>/src/**/*.{js,jsx,ts,tsx}"],
  globals: {
    COMMITHASH: "test-commit-hash",
  },
  setupFilesAfterEnv: ["<rootDir>/test/setup.js"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|mjs|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(.+/)?(@asamuzakjp/|@bramus/|@csstools/|@exodus/|ccount|character-entities|copy-text-to-clipboard|css-tree|decode-named-character-reference|devlop|entities|escape-string-regexp|ky|longest-streak|lru-cache|markdown-table|mdast-util-|micromark-|non-error|parse-entities|parse5|serialize-error|strip-indent|tough-cookie|unist-|zwitch))",
  ],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  moduleNameMapper: {
    "\\.svg$": "<rootDir>/__mocks__/svg.js",
    "\\.scss": "<rootDir>/__mocks__/styleMock.js",
  },
};
