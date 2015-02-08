var currentTickets = [];

function displayHowto() {
  $("#content").empty();
  $("#content").append("Open a ticket first");
}

function displayCopyPanel(ticket) {
  $("#content").empty();

  var commitMessage = "[" + ticket.id + "] " + ticket.title;
  var gitBranch = cleanTitleForGitBranch(ticket.type, ticket.id + "-" + ticket.title);

  $("#content").append("<button class='to-clipboard' data-clipboard-text='" + escape(commitMessage) + "'>" + commitMessage + "</button>");
  $("#content").append("<button class='to-clipboard' data-clipboard-text='" + escape(gitBranch)     + "'>" + gitBranch     + "</button>");
}

function cleanTitleForGitBranch(storyType, title) {
  if (!storyType || storyType.length == 0) {
    storyType = "feature";
  }

  var translate = {
    "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss"
  };
  var cleanedTitle = storyType + "/" + title.toLowerCase().replace(/[öäüß]/g, function(match) { 
    return translate[match];
  }).replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-/, "").replace(/-$/, "");

  return cleanedTitle;
}

function displayTicketSelect(tickets) {
  currentTickets = tickets;
  $("#content").empty();
  $("#content").append("Select the Ticket:");
}

function updateTickets(tickets) {
  if (!tickets || tickets.length == 0) {
    displayHowto();
  } else if (tickets.length > 1) {
    displayTicketSelect(tickes);
  } else if (tickets.length == 1) {
    displayCopyPanel(tickets[0]);
  }
}

$("body").on("click", ".to-clipboard", function(event) {
  var text = unescape($(event.target).attr("data-clipboard-text"));
  var copyFrom = $('<textarea/>');
  copyFrom.text(text);
  $('body').append(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  copyFrom.remove();
});

function showSelect() {
  chrome.extension.getBackgroundPage().getTickets(function(tickets) {
    updateTickets(tickets);
  });
}

window.onload = showSelect;
