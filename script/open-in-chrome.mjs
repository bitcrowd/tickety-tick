#!/usr/bin/env node

// usage: open-in-chrome [extension-dir] [starting-url]

import * as path from "path";
import * as launcher from "chrome-launcher";

const dir = process.argv[2] || path.join(__dirname, "..", "dist", "chrome");
const url = process.argv[3] || "https://github.com/bitcrowd/tickety-tick";

async function launchChrome() {
  const chromeFlags = launcher.Launcher.defaultFlags()
    .filter((flag) => flag !== "--disable-extensions")
    .concat([
      "--remote-debugging-pipe",
      "--enable-unsafe-extension-debugging",
      "--no-first-run",
      "--no-default-browser-check",
    ]);

  const options = {
    chromeFlags,
    ignoreDefaultFlags: true,
    startingUrl: url,
  };

  const chrome = await launcher.launch(options);

  if (chrome.port !== 0) {
    console.warn(
      "⚠️ Expected remote-debugging-pipe mode on port 0, but got a debug port.",
    );
  }

  const pipes = chrome.remoteDebuggingPipes;
  if (!pipes) {
    throw new Error("Chrome did not expose remoteDebuggingPipes");
  }

  console.log("🚀 Chrome launched with remote-debugging-pipe.");
  console.log(`📂 Loading extension from: ${dir}`);

  const requestId = Math.floor(Math.random() * 1e6);
  const request = {
    id: requestId,
    method: "Extensions.loadUnpacked",
    params: { path: dir },
  };

  // --- Send command and wait for response
  const firstResponse = new Promise((resolve, reject) => {
    let buffer = "";

    pipes.incoming.on("error", reject);
    pipes.incoming.on("close", () =>
      reject(new Error("Pipe closed before response")),
    );

    pipes.incoming.on("data", (chunk) => {
      buffer += chunk;
      let end;
      while ((end = buffer.indexOf("\x00")) !== -1) {
        const message = buffer.slice(0, end);
        buffer = buffer.slice(end + 1);
        try {
          const parsed = JSON.parse(message);
          if (parsed.id === requestId) {
            resolve(parsed);
          }
        } catch {
          // ignore non-JSON noise
        }
      }
    });
  });

  pipes.outgoing.write(JSON.stringify(request) + "\x00");

  const response = await firstResponse;
  if (response.error) {
    throw new Error(`Failed to load extension: ${response.error.message}`);
  }

  console.log(`✅ Extension loaded (id: ${response.result.id})`);
  console.log(`🌐 Opening: ${url}`);

  chrome.process.on("exit", () => {
    console.log("💨 Chrome closed.");
    process.exit(0);
  });
}

launchChrome().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
