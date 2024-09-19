import browser from "webextension-polyfill";

import type { BackgroundMessage } from "../popup/types";

async function getTickets() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const results = await browser.tabs.sendMessage(tab.id!, { tickets: true }); // eslint-disable-line @typescript-eslint/no-non-null-assertion
  return results;
}

async function handleMessage(msg: BackgroundMessage) {
  if (msg.getTickets) {
    return getTickets();
  }
  return null;
}

browser.runtime.onMessage.addListener(handleMessage);
