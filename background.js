// Global accessor that the popup uses.
var selectedTabId = null

function updateTickets(tabId) {
  chrome.pageAction.hide(tabId);
  chrome.tabs.sendRequest(tabId, {supported: true}, function(supported) {
    if (supported == undefined) {
      chrome.pageAction.hide(tabId);
    } else {
      chrome.pageAction.show(tabId);
    }
  });
}

function getTickets(callback) {
  chrome.tabs.sendRequest(selectedTabId, {tickets: true}, function(newTickets) {
    console.log(newTickets);
    callback(newTickets);
  });
}

chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
  if (change.status == "complete") {
    updateTickets(tab.id);
  }
});

chrome.tabs.onSelectionChanged.addListener(function(tabId, info) {
  selectedTabId = tabId;
  updateTickets(tabId);
});

// Ensure the current selected tab is set up.
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  selectedTabId = tabs[0].id;
  updateTickets(tabs[0].id);
});
