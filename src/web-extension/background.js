import browser from 'webextension-polyfill';

async function getTickets() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const tickets = await browser.tabs.sendMessage(tab.id, { tickets: true });
  return tickets;
}

window.getTickets = getTickets;
