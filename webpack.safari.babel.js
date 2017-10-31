/* eslint-disable import/no-extraneous-dependencies */

import config, { src, dist } from './webpack.common';

// Configure separate entry points.

config.entry('popup').add(src.safari('popup', 'popup.jsx'));
config.entry('content').add(src.safari('content.js'));

// Set browser-specific output path.

config.output.path(dist('tickety-tick.safariextension'));

// Copy the Info.plist in addition to the common files.

config.plugin('copy').tap(([patterns]) => [[
  ...patterns,
  {
    from: src.safari('Info.plist'),
    flatten: true,
  },
]]);

export default config.toConfig();
