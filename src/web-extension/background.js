/* global chrome */

function getTickets(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { tickets: true }, (tickets) => {
      callback(tickets);
    });
  });
}

window.getTickets = getTickets;
