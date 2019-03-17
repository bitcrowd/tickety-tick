import browser from 'webextension-polyfill';

async function getTickets() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const results = await browser.tabs.sendMessage(tab.id, { tickets: true });
  return results;
}

window.getTickets = getTickets;
