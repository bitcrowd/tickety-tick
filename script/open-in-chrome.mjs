#!/usr/bin/env node

// usage: open-in-chrome [extension-dir] [starting-url]

import * as launcher from "chrome-launcher";
import * as path from "path";

const dir = process.argv[2] || path.join(__dirname, "..", "dist", "chrome");
const url = process.argv[3] || "https://github.com/bitcrowd/tickety-tick";

const chromeFlags = launcher.Launcher.defaultFlags()
  .filter((flag) => flag !== "--disable-extensions")
  .concat(["--no-default-browser-check", `--load-extension=${dir}`]);

const options = {
  chromeFlags,
  ignoreDefaultFlags: true,
  startingUrl: url,
};

launcher.launch(options).then((chrome) => {
  console.log(`Chrome debugging port on ${chrome.port}`); // eslint-disable-line no-console
});
