/* eslint-disable import/no-extraneous-dependencies */

import config, { src, dist } from './webpack.common';

// Configure separate entry points.

config.entry('popup').add(src.safari('popup', 'popup.js'));
config.entry('content').add(src.safari('content.js'));

// Set browser-specific output path.

config.output.path(dist('tickety-tick.safariextension'));

// Copy Info.plist and Settings.plist in addition to the common files.

config.plugin('copy').tap(([patterns]) => [[
  ...patterns,
  {
    from: src.safari('Info.plist'),
    flatten: true,
  },
  {
    from: src.safari('Settings.plist'),
    flatten: true,
  },
]]);

export default config.toConfig();
