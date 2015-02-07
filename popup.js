function showSelect() {
  chrome.extension.getBackgroundPage().getTickets(function(tickets) {
    console.log(tickets);
    el = document.querySelectorAll('body')[0];
    if (tickets[0]) {
      el.insertAdjacentHTML('afterend', "" + tickets[0].type + "[" + tickets[0].id + "] " + tickets[0].title);
    } else {
      el.insertAdjacentHTML('afterend', "open ticket first");
    }
  });
}

window.onload = showSelect;
