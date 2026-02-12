import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { defineConfig } from "eslint/config"; // eslint-disable-line import/no-unresolved
import jestPlugin from "eslint-plugin-jest";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint"; // eslint-disable-line import/no-unresolved

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    ignores: [
      "dist/",
      "release-artifacts/",
      "node_modules/",
      ".eslintcache/",
      ".npm/",
      "coverage/",
    ],
  },
  {
    extends: [
      // airbnb and import/typescript share the import plugin, so both need
      // to go through compat to avoid a "Cannot redefine plugin" error.
      // This can go one airbnb supports the flat config format.
      ...fixupConfigRules(
        compat.extends("airbnb", "airbnb/hooks", "plugin:import/typescript"),
      ),
      jestPlugin.configs["flat/recommended"],
      ...tseslint.configs.recommended,
      eslintPluginPrettierRecommended,
    ],

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

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
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
            "webpack.config.ts",
            "postcss.config.js",
            "src/**/*.test.jsx",
            "src/**/*.test.tsx",
            "src/**/*.test.js",
            "src/**/*.test.ts",
            "test/**/*.js",
            "test/**/*.ts",
            "script/*",
            "eslint.config.mjs",
          ],
        },
      ],

      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          specialLink: ["to"],
        },
      ],

      "no-unused-vars": "off", // handled by @typescript-eslint/no-unused-vars
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
  {
    files: ["script/**"],
    rules: {
      "no-console": "off",
    },
  },
]);
