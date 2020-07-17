/* eslint-disable simple-import-sort/sort */

import path from 'path';

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import image from '@rollup/plugin-image';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';

import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

// Small variations between browsers supporting the WebExtensions API are
// handled by setting the extension variant as an environment variable, for
// instance: 'chrome', 'firefox' or 'opera'.
const variant = process.env.VARIANT;

// Path helpers

function src(...p) {
  return path.join(__dirname, 'src', ...p);
}

function dist(...p) {
  return path.join(__dirname, 'dist', ...p);
}

// …

function bundle(name, input, output, page = null) {
  const plugins = [
    resolve({ extensions: ['.js', '.json', '.jsx', '.mjs'] }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'), // TODO: Set development vs. production
      COMMITHASH: JSON.stringify('xxx'), // TODO
    }),
    commonjs({}),
    babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' }),
    terser({}), // TODO: Disable minification for development
    image({}),
    postcss({
      config: { path: 'postcss.config.js' },
      extract: true,
      minimize: true,
    }),
  ];

  if (page) plugins.push(html(page));

  return { input, output, plugins };
}

// Create a configuration.

export default [
  bundle('background', src('background', 'index.js'), {
    dir: dist(variant, 'background'),
  }),
  bundle('content', src('content', 'index.js'), {
    dir: dist(variant, 'content'),
  }),
  bundle(
    'options',
    src('options', 'index.jsx'),
    {
      dir: dist(variant, 'options'),
    },
    { title: 'Options' }
  ),
  bundle(
    'popup',
    src('popup', 'index.js'),
    { dir: dist(variant, 'popup') },
    { title: 'Tickety-Tick' }
  ),
  {
    input: src('blank.js'),
    output: { dir: dist(variant) },
    plugins: [
      copy({
        targets: [
          { src: src('icons', '*.png'), dest: dist(variant) },
          {
            src: src('manifest.json'),
            dest: dist(variant),
            transform: (content) => {
              const mf = JSON.parse(content);

              mf.name = pkg.name;
              mf.version = pkg.version;
              mf.description = pkg.description;

              if (variant === 'firefox') {
                mf.options_ui.browser_style = true;
                mf.applications = {
                  gecko: {
                    id: 'jid1-ynkvezs8Qn2TJA@jetpack',
                  },
                };
              } else {
                mf.options_ui.chrome_style = true;
              }

              return JSON.stringify(mf);
            },
          },
        ],
      }),
    ],
  },
];
