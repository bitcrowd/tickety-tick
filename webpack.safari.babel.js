/* eslint-disable import/no-extraneous-dependencies */

import ZipWebpackPlugin from 'zip-webpack-plugin';

import config, { src, dist } from './webpack.common';
import pkg from './package.json';

// Configure separate entry points.

config.entry('popup').add(src.safari('popup', 'popup.js'));
config.entry('content').add(src.safari('content.js'));

// Set browser-specific output path.

const safariExtensionFolderName = 'tickety-tick.safariextension';

config.output.path(dist(safariExtensionFolderName));

// Copy Info.plist and Settings.plist in addition to the common files.

config.plugin('copy').tap(([patterns, options]) => [[
  ...patterns,
  {
    from: src.safari('Info.plist'),
    transform: (content) => {
      const replacer = (match, field) => pkg[field] || match;
      return content.toString().replace(/<!-- ([^ ]+) -->/g, replacer);
    },
  },
  {
    from: src.safari('Settings.plist'),
  },
], options]);

config.when(process.env.BUNDLE === 'true', cfg => cfg
  .plugin('zip')
  .use(ZipWebpackPlugin, [
    {
      path: dist('release'),
      pathPrefix: safariExtensionFolderName,
      filename: 'safari',
    },
  ]));

export default config.toConfig();
