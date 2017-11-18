/* eslint-disable import/no-extraneous-dependencies */

import path from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

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
//   - web-extension browsers include a background.js, safari does not
// - output.path: we create separate output directories for each browser
// - copy-webpack-plugin copy patterns: manifest.json != Info.plist

const config = new Config();

config.context(__dirname);

config.output.filename('[name].js');

config.resolve.extensions
  .add('.js')
  .add('.jsx')
  .add('.json');

config.module.rule('js')
  .test(/\.jsx?$/)
  .exclude.add(/node_modules/).end()
  .use('babel').loader('babel-loader');

config.module.rule('css')
  .test(/\.scss$/)
  .merge({
    use: ExtractTextPlugin.extract([
      {
        loader: 'css-loader',
        options: { sourceMap: true },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          config: {
            ctx: {
              compat: [
                'last 2 Chrome versions',
                'last 2 Firefox versions',
                'last 2 Opera versions',
                'last 2 Safari versions',
              ],
            },
          },
        },
      },
      {
        loader: 'sass-loader',
        options: { sourceMap: true },
      },
    ]),
  });

config.plugin('html')
  .use(HtmlWebpackPlugin, [{
    template: src.common('popup', 'popup.html'),
    filename: 'popup.html',
    chunks: ['popup'],
    inject: true,
    minify: {
      collapseWhitespace: true,
      removeScriptTypeAttributes: true,
    },
  }]);

config.plugin('extract')
  .use(ExtractTextPlugin, [{
    filename: 'popup.css',
  }]);

config.plugin('copy')
  .use(CopyWebpackPlugin, [[
    {
      from: src.common('icons', '*.png'),
      flatten: true,
    },
  ]]);

config.devtool('source-map');

export default config;
