function showSelect() {
  chrome.extension.getBackgroundPage().getTickets(function(tickets) {
    if (tickets[0]) {
      $("#content").append(tickets[0].type + "[" + tickets[0].id + "] " + tickets[0].title);
    } else {
      $("#content").append("open ticket first");
    }
  });
}

window.onload = showSelect;
