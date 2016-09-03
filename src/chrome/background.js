/* eslint-env browser */
/* globals chrome */

const exports = window;

function getTickets(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { tickets: true }, (newTickets) => {
      callback(newTickets);
    });
  });
}

exports.getTickets = getTickets;
