/* eslint-disable import/no-extraneous-dependencies */

import ZipWebpackPlugin from 'zip-webpack-plugin';

import config, { src, dist } from './webpack.common';
import pkg from './package.json';

// Small variations between browsers supporting the WebExtensions API are
// handled by setting the extension variant as an environment variable, for
// instance: 'chrome', 'firefox', 'firefox-local' or 'opera'.
const variant = process.env.VARIANT;

// Configure separate entry points.

config.entry('popup').add(src.webext('popup', 'popup.jsx'));
config.entry('content').add(src.webext('content.js'));
config.entry('background').add(src.webext('background.js'));

// Set browser-specific output path.

config.output.path(dist(variant));

// Copy the manifest.json template in addition to default files.

config.plugin('copy').tap(([patterns]) => [[
  ...patterns,
  {
    from: src.webext('manifest.json'),
    transform: (content) => {
      const mf = JSON.parse(content);

      mf.name = pkg.name;
      mf.version = pkg.version;
      mf.description = pkg.description;

      if (variant === 'firefox-local') {
        mf.applications = {
          gecko: {
            id: 'tickety-tick@bitcrowd.net',
          },
        };
      }

      return JSON.stringify(mf);
    },
  },
]]);

config.when(process.env.BUNDLE === 'true', cfg =>
  cfg.plugin('zip')
    .use(ZipWebpackPlugin, [
      {
        path: dist(),
        filename: variant,
      },
    ]));

export default config.toConfig();
