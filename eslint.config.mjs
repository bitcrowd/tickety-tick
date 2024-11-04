import path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupConfigRules, includeIgnoreFile } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url); // eslint-disable-line no-underscore-dangle
const __dirname = path.dirname(__filename); // eslint-disable-line no-underscore-dangle
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
  ...fixupConfigRules(
    compat.extends(
      "airbnb",
      "airbnb/hooks",
      "plugin:import/typescript",
      "plugin:jest/recommended",
      "plugin:prettier/recommended",
      "plugin:@typescript-eslint/recommended",
    ),
  ),
  includeIgnoreFile(gitignorePath),
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mjs", "**/*.js"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        COMMITHASH: "readonly",
      },
    },

    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],

      "@typescript-eslint/explicit-module-boundary-types": "off",

      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-use-before-define": "error",

      "import/extensions": [
        "error",
        {
          js: "never",
          json: "always",
          ts: "never",
        },
      ],

      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "eslint.config.mjs",
            "webpack.config.ts",
            "script/open-in-chrome.mjs",
            "src/**/*.test.jsx",
            "src/**/*.test.tsx",
            "src/**/*.test.js",
            "src/**/*.test.ts",
            "test/**/*.js",
            "test/**/*.ts",
            "script/*",
          ],
        },
      ],

      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          specialLink: ["to"],
        },
      ],

      "no-use-before-define": "off",
      "prettier/prettier": "error",

      "react/jsx-filename-extension": [
        "error",
        {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],

      "react/jsx-props-no-spreading": "off",
      "react/require-default-props": "off",
      "react/prop-types": "off",
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
    },
  },
];
