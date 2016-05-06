/* globals chrome */

function getTickets(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendRequest(tabs[0].id, { tickets: true }, function (newTickets) {
      callback(newTickets);
    });
  });
}
