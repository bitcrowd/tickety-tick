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
  var storyTitles = []
  if ((story = $(".ghx-fieldname-issuekey a")).length > 0){
    var title = $("[data-field-id='summary']").text();
    var id = story.text();
    storyTitles.push({id: id, title: title});
  } else if ((story = $(".aui-page-header-inner .aui-page-header-main")).length > 0) {
    var title = $("#summary-val", story).text();
    var id = $(".issue-link", story).text();
    storyTitles.push({id: id, title: title});
  }

  return storyTitles;
}
