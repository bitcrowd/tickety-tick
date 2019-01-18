/* eslint-disable import/no-extraneous-dependencies */

import HtmlWebpackPlugin from 'html-webpack-plugin';
import ZipWebpackPlugin from 'zip-webpack-plugin';

import config, { src, dist } from './webpack.common';
import pkg from './package.json';

// Small variations between browsers supporting the WebExtensions API are
// handled by setting the extension variant as an environment variable, for
// instance: 'chrome', 'firefox' or 'opera'.
const variant = process.env.VARIANT;

// Configure separate entry points.

config.entry('options').add(src.webext('options', 'options.jsx'));
config.entry('popup').add(src.webext('popup', 'popup.js'));
config.entry('content').add(src.webext('content.js'));
config.entry('background').add(src.webext('background.js'));

// Set browser-specific output path.

config.output.path(dist(variant));

// Create the options.html in addition to common files.

config.plugin('options-html')
  .use(HtmlWebpackPlugin, [{
    template: src.webext('options', 'options.html'),
    filename: 'options.html',
    chunks: ['options'],
    inject: true,
    minify: {
      collapseWhitespace: true,
      removeScriptTypeAttributes: true,
    },
  }]);

// Copy the manifest.json template in addition to common files.

config.plugin('copy').tap(([patterns]) => [[
  ...patterns,
  {
    from: src.webext('manifest.json'),
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
]]);

config.when(process.env.BUNDLE === 'true', cfg => cfg
  .plugin('zip')
  .use(ZipWebpackPlugin, [
    {
      path: dist(),
      filename: variant,
    },
  ]));

export default config.toConfig();
