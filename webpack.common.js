/* eslint-disable import/no-extraneous-dependencies */

// eslint-disable-next-line simple-import-sort/sort
import path from 'path';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import GitRevisionPlugin from 'git-revision-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { DefinePlugin } from 'webpack';
import NotifierPlugin from 'webpack-build-notifier';
import Config from 'webpack-chain';

// Path helpers

export function src(...p) {
  return path.join(__dirname, 'src', ...p);
}

src.common = src.bind(null, 'common');
src.webext = src.bind(null, 'web-extension');
src.safari = src.bind(null, 'safari-extension');

export function dist(...p) {
  return path.join(__dirname, 'dist', ...p);
}

// Common build options for all browsers are set below. Browser-specific
// settings and overrides are defined in separate files, specifically:
//
// - entry
//   - popup entry point differs between web-extension browsers and safari
//   - content script differs between web-extension browsers and safari
//   - web-extension browsers include a background.js and options.js
// - output.path: we create separate output directories for each browser
// - plugins:
//   - copy:
//     - web-extension browsers add manifest.json
//     - safari adds Info.plist and Settings.plist
//   - options-html: web-extension browsers add options.html

const config = new Config();

config.context(__dirname);

config.output.filename('[name].js');

config.resolve.extensions.add('.js').add('.jsx').add('.json');

config.module
  .rule('js')
  .test(/\.jsx?$/)
  .exclude.add(/node_modules/)
  .end()
  .use('babel')
  .loader('babel-loader');

config.module
  .rule('css')
  .test(/\.scss$/)
  .merge({
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: { sourceMap: true },
      },
      {
        loader: 'css-loader',
        options: { sourceMap: true },
      },
      {
        loader: 'postcss-loader',
        options: { sourceMap: true },
      },
      {
        loader: 'sass-loader',
        options: { sourceMap: true },
      },
    ],
  });

config.module
  .rule('images')
  .test(/\.png$/)
  .exclude.add(/node_modules/)
  .end()
  .use('images')
  .loader('file-loader')
  .options({ name: '[name].[hash].[ext]' });

config.plugin('clean').use(CleanWebpackPlugin, []);

config.plugin('html').use(HtmlWebpackPlugin, [
  {
    template: src.common('popup', 'popup.html'),
    filename: 'popup.html',
    chunks: ['popup'],
    inject: true,
    minify: {
      collapseWhitespace: true,
      removeScriptTypeAttributes: true,
    },
    cache: false,
  },
]);

config.plugin('extract').use(MiniCssExtractPlugin, [
  {
    filename: '[name].css',
  },
]);

config.plugin('copy').use(CopyWebpackPlugin, [
  [
    {
      from: src.common('icons', '*.png'),
      flatten: true,
    },
  ],
  {
    copyUnmodified: true,
  },
]);

const revision = new GitRevisionPlugin();

config.plugin('revision').use(revision);

config
  .plugin('define')
  .after('revision')
  .use(DefinePlugin, [
    {
      COMMITHASH: JSON.stringify(revision.commithash()),
    },
  ]);

config.plugin('notifier').use(NotifierPlugin, [
  {
    title: 'Tickety-Tick Build',
  },
]);

config.devtool('source-map');

export default config;
