var currentTickets = [];

function displayHowto() {
  $("#content").empty();
  $("#content").append(
    "<h1><img src='../icon16.png'/> ticket git</h1>" +
    "<p>Open a ticket and then click this extension.</p>" +
    "<p>" +
      "You then can select if you want to create a commit messag or a branch name " +
      "based on that ticket."  +
    "</p><p>" +
      "If you have selected more than one ticket, you can then select " +
      "the ticket to use." +
    "</p><p>" +
      "Logo by <a class='external' target='_blank' href='http://thenounproject.com/term/ticket/92194/'>Alejandro Santander</a> under CC-BY&nbsp;3.0" +
    "</p>"
  );
  $(":focus").blur();
}

function displayCopyPanel(ticket) {
  $("#content").empty();

  var commitMessage = "[#" + ticket.id + "] " + ticket.title;
  var gitBranch = cleanTitleForGitBranch(ticket.type, ticket.id + "-" + ticket.title);

  $("#content").append("<h1>" + commitMessage + "</h1>");

  linkList = "<ul class='button-list'>"+
             "<li><a href='#' class='to-clipboard' data-clipboard-text='" + escape(commitMessage) + "'>Commit message</a></li>" +
             "<li><a href='#' class='to-clipboard' data-clipboard-text='" + escape(gitBranch)     + "'>Branch name</a></li>" +
             "</ul>"
  $("#content").append(linkList);

  if (currentTickets.length > 1) {
    $("#content").append("<p><a href='#' class='to-select'>&laquo; Zurück</a></p>");

    $(".to-select").click(function(event) {
      displayTicketSelect(currentTickets);
      event.preventDefault();
    });
  }
  $("#content a").first().focus();
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
  $("#content").append("<h1>Select the Ticket:</h1>");
  ticketList = "";
  tickets.sort(function(a, b) {
    return a.title.localeCompare(b.title);
  }).forEach(function(ticket, index) {
    ticketList += "<li><a href='#' class='select-ticket' data-ticket-number='" + index + "'>" + ticket.title + "</a></li>";
  });
  $("#content").append("<ul class='button-list'>" + ticketList + "</ul>");
  $("#content a").first().focus();

  $(".select-ticket").click(function(event) {
    var number = $(event.target).attr("data-ticket-number");
    displayCopyPanel(currentTickets[number]);
    event.preventDefault();
  });
}

function updateTickets(tickets) {
  if (!tickets || tickets.length == 0) {
    displayHowto();
  } else if (tickets.length > 1) {
    displayTicketSelect(tickets);
  } else if (tickets.length == 1) {
    displayCopyPanel(tickets[0]);
  }
}

$("body").on("click", "a.external", function(event) {
  setTimeout(function() {
    closeWindow();
  }, 100);
  if (bowser.safari) {
    safari.application.activeBrowserWindow.openTab().url = $(this).attr("href");
    event.preventDefault();
  }
});

$("body").on("click", ".to-clipboard", function(event) {
  var text = unescape($(event.target).attr("data-clipboard-text"));
  copyToClipboard(text);
  closeWindow();
  event.preventDefault();
});

$("body").on("click", ".about", function(event) {
  displayHowto();
  event.preventDefault();
});

function copyToClipboard(text) {
  if (bowser.chrome) {
    var copyFrom = $('<textarea/>');
    copyFrom.text(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();
  } else if (bowser.firefox && self.port) {
    self.port.emit("set-clipboard", text);
  } else if (bowser.safari) {
    prompt('Here you go:', text);
  }
}

function closeWindow() {
  if (bowser.chrome) {
    window.close();
  } else if (bowser.firefox && self.port) {
    self.port.emit("close");
  } else if (bowser.safari) {
    safari.self.hide();
  }
}

function loadTicketsForChrome() {
  chrome.extension.getBackgroundPage().getTickets(function(tickets) {
    updateTickets(tickets);
  });
}

function loadTicketsForFirefox() {
  self.port.on("tickets", function onTickets(tickets) {
    updateTickets(tickets);
  });
  self.port.on("show", function onShow() {
    self.port.emit("get-tickets");
  });
}

function handleSafariMessage(msgEvent) {
    var messageName = msgEvent.name;
    var messageData = msgEvent.message;
    if (messageName === "tickets") {
      updateTickets(messageData);
    }
}

function popoverSafariHandler(msgEvent) {
  safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("get-tickets");
}

function loadTicketsForSafari() {
  safari.application.addEventListener("message", handleSafariMessage, false);
  safari.application.addEventListener("popover", popoverSafariHandler, true);

  safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("get-tickets");
}

function init() {
  displayHowto();
  if (bowser.chrome) {
    loadTicketsForChrome();
  } else if (bowser.firefox) {
    loadTicketsForFirefox();
  } else if (bowser.safari) {
    loadTicketsForSafari();
  }
}

window.onload = init;
