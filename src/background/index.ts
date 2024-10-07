import browser from "webextension-polyfill";

import type { BackgroundMessage, ContentMessage } from "../types";

async function getTickets() {
  const message: ContentMessage = { tickets: true };
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const results = await browser.tabs.sendMessage(tab.id!, message); // eslint-disable-line @typescript-eslint/no-non-null-assertion
  return results;
}

async function handleMessage(message: unknown) {
  if ((message as BackgroundMessage).getTickets) {
    return getTickets();
  }
  return null;
}

browser.runtime.onMessage.addListener(handleMessage);
