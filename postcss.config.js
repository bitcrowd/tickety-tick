module.exports = {
  plugins: [
    ["@fullhuman/postcss-purgecss", { content: ["src/**/*.{html,ts,tsx}"] }],
    ["postcss-preset-env", {}],
    ["cssnano", { preset: "default" }],
  ],
};
