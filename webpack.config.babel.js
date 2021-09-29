// eslint-disable-next-line simple-import-sort/imports
import path from "path";

import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { GitRevisionPlugin } from "git-revision-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { DefinePlugin } from "webpack";
import NotifierPlugin from "webpack-build-notifier";
import ZipWebpackPlugin from "zip-webpack-plugin";
import Config from "webpack-chain";

import pkg from "./package.json";

// Small variations between browsers supporting the WebExtensions API are
// handled by setting the extension variant as an environment variable, for
// instance: 'chrome', 'firefox' or 'opera'.
const variant = process.env.VARIANT;

// Path helpers

export function src(...p) {
  return path.join(__dirname, "src", ...p);
}

export function dist(...p) {
  return path.join(__dirname, "dist", ...p);
}

// Create a configuration.

const config = new Config();

config.mode(process.env.NODE_ENV ?? "production");

config.context(__dirname);

// Configure separate entry points.

config.entry("background").add(src("background", "index.ts"));
config.entry("content").add(src("content", "index.ts"));
config.entry("options").add(src("options", "index.tsx"));
config.entry("popup").add(src("popup", "index.ts"));

// Set browser-specific output path.

config.output.path(dist(variant));

config.output.filename("[name].js");

// Configure module/import resolution.

config.resolve.extensions.add(".js").add(".json").add(".ts").add(".tsx");

config.module
  .rule("js")
  .test(/\.jsx?$/)
  .exclude.add(/node_modules/)
  .end()
  .use("babel")
  .loader("babel-loader");

config.module
  .rule("ts")
  .test(/\.tsx?$/)
  .exclude.add(/node_modules/)
  .end()
  .use("typescript")
  .loader("ts-loader");

config.module
  .rule("css")
  .test(/\.scss$/)
  .merge({
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: "css-loader",
        options: { sourceMap: true },
      },
      {
        loader: "postcss-loader",
        options: { sourceMap: true },
      },
      {
        loader: "sass-loader",
        options: { sourceMap: true },
      },
    ],
  });

config.module
  .rule("svgs")
  .test(/\.svg$/)
  .exclude.add(/node_modules/)
  .end()
  .use("svgr")
  .loader("@svgr/webpack")
  .options({ prettier: false, svgo: false, ref: true })
  .end()
  .use("svg-file")
  .loader("file-loader")
  .options({ name: "[name].[contenthash].[ext]" });

// Clean up output directory before building.

config.plugin("clean").use(CleanWebpackPlugin, []);

// Create the popup.html.

config.plugin("html").use(HtmlWebpackPlugin, [
  {
    template: src("popup", "index.html"),
    filename: "popup.html",
    chunks: ["popup"],
    inject: true,
    minify: {
      collapseWhitespace: true,
      removeScriptTypeAttributes: true,
    },
    cache: false,
  },
]);

// Create the options.html.

config.plugin("options-html").use(HtmlWebpackPlugin, [
  {
    template: src("options", "index.html"),
    filename: "options.html",
    chunks: ["options"],
    inject: true,
    minify: {
      collapseWhitespace: true,
      removeScriptTypeAttributes: true,
    },
    cache: false,
  },
]);

// Extract CSS into a separate file per entry.

config.plugin("extract").use(MiniCssExtractPlugin, [
  {
    filename: "[name].css",
  },
]);

// Copy extension icons and the manifest.json template.

config.plugin("copy").use(CopyWebpackPlugin, [
  {
    patterns: [
      {
        from: src("icons", "*.png"),
        to: "[name][ext]",
      },
      {
        from: src("manifest.json"),
        transform: (content) => {
          const mf = JSON.parse(content);

          mf.name = pkg.name;
          mf.version = pkg.version;
          mf.description = pkg.description;

          if (variant === "firefox") {
            mf.options_ui.browser_style = true;
            mf.applications = {
              gecko: {
                id: "jid1-ynkvezs8Qn2TJA@jetpack",
              },
            };
          } else {
            mf.options_ui.chrome_style = true;
          }

          return JSON.stringify(mf);
        },
      },
    ],
  },
]);

// Inject Git revision information.

const revision = new GitRevisionPlugin();

config.plugin("revision").use(revision);

config
  .plugin("define")
  .after("revision")
  .use(DefinePlugin, [
    {
      COMMITHASH: JSON.stringify(revision.commithash()),
    },
  ]);

// Show build notifications.

config.plugin("notifier").use(NotifierPlugin, [
  {
    title: "Tickety-Tick Build",
  },
]);

// Configure source-maps.

config.devtool("source-map");

// Create ZIP bundles if requested.

config.when(process.env.BUNDLE === "true", (cfg) =>
  cfg.plugin("zip").use(ZipWebpackPlugin, [
    {
      path: dist(),
      filename: variant,
    },
  ])
);

export default config.toConfig();
