import CopyWebpackPlugin from "copy-webpack-plugin";
import { GitRevisionPlugin } from "git-revision-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import type { Configuration } from "webpack";
import { DefinePlugin } from "webpack";
import ZipWebpackPlugin from "zip-webpack-plugin";

import pkg from "./package.json";

// Small variations between browsers supporting the WebExtensions API
const variant = process.env.VARIANT as string | undefined;

// Helper functions for paths
function src(...p: string[]): string {
  return path.join(__dirname, "src", ...p);
}

function dist(...p: string[]): string {
  return path.join(__dirname, "dist", ...p);
}

// Initialize GitRevisionPlugin
const revision = new GitRevisionPlugin();

// Define the Webpack configuration as a TypeScript object
const config: Configuration = {
  mode: (process.env.NODE_ENV as "development" | "production") ?? "production",
  context: __dirname,

  entry: {
    background: src("background", "index.ts"),
    content: src("content", "index.ts"),
    options: src("options", "index.tsx"),
    popup: src("popup", "index.ts"),
  },

  output: {
    path: dist(variant!),
    filename: "[name].js",
  },

  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: {
          loader: "@svgr/webpack",
          options: { prettier: false, svgo: false, ref: true },
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: src("popup", "index.html"),
      filename: "popup.html",
      chunks: ["popup"],
      inject: true,
      minify: {
        collapseWhitespace: true,
        removeScriptTypeAttributes: true,
      },
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: src("options", "index.html"),
      filename: "options.html",
      chunks: ["options"],
      inject: true,
      minify: {
        collapseWhitespace: true,
        removeScriptTypeAttributes: true,
      },
      cache: false,
    }),

    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: src("icons", "*.png"),
          to: "[name][ext]",
        },
        {
          from: src("manifest.json"),
          transform: (content) => {
            const mf = JSON.parse(content.toString());
            mf.name = pkg.name;
            mf.version = pkg.version;
            mf.description = pkg.description;

            if (variant === "firefox") {
              mf.browser_specific_settings = {
                gecko: {
                  id: "jid1-ynkvezs8Qn2TJA@jetpack",
                },
              };
            }
            return JSON.stringify(mf);
          },
        },
      ],
    }),

    revision,

    new DefinePlugin({
      COMMITHASH: JSON.stringify(revision.commithash()),
    }),

    ...(process.env.BUNDLE === "true"
      ? [
          new ZipWebpackPlugin({
            path: dist(),
            filename: variant,
          }),
        ]
      : []),
  ],

  devtool: "source-map",
};

export default config;
