if (window == top) {
  chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
    if (req.supported) {
      sendResponse(true);
    } else if (req.tickets) {
      sendResponse(findOpenTickets());
    }
  });
}

var findOpenTickets = function() {
  if ($(".gh-header-number").length > 0) {
    var title = $(".js-issue-title").text();
    var id = $(".gh-header-number").text().substr(1);
    var type = "feature";
    if ($(".sidebar-labels .label[title='bug']").length > 0) {
      type = "bug"
    }
    return [{type: type, title: title, id: id}];
  } else {
    return [];
  }
}
