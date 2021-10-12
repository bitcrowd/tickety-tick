module.exports = {
  plugins: [
    [
      "@fullhuman/postcss-purgecss",
      {
        contentFunction: (src) => {
          if (src.endsWith("src/popup/index.scss")) {
            return ["src/popup/**/*.{html,ts,tsx}"];
          }
          if (src.endsWith("src/options/index.scss")) {
            return ["src/options/**/*.{html,ts,tsx}"];
          }
          throw new Error(`Unexpected CSS entrypoint: ${src}`);
        },
      },
    ],
    ["postcss-preset-env", {}],
    ["cssnano", { preset: "default" }],
  ],
};
