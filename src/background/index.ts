import browser from "webextension-polyfill";

async function getTickets() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const results = await browser.tabs.sendMessage(tab.id!, { tickets: true }); // eslint-disable-line @typescript-eslint/no-non-null-assertion
  return results;
}

Object.assign(window, { getTickets });
