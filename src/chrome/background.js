function updateTickets(tabId) {
  chrome.pageAction.hide(tabId);
  chrome.tabs.sendRequest(tabId, {tickets: true}, function(tickets) {
    if (tickets == null) {
      chrome.pageAction.hide(tabId);
    } else {
      chrome.pageAction.show(tabId);
    }
  });
}

function getTickets(callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendRequest(tabs[0].id, {tickets: true}, function(newTickets) {
      callback(newTickets);
    });
  });
}

chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
  if (change.status == "complete") {
    updateTickets(tab.id);
  }
});

chrome.tabs.onSelectionChanged.addListener(function(tabId, info) {
  updateTickets(tabId);
});

// Ensure the current selected tab is set up.
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  updateTickets(tabs[0].id);
});
