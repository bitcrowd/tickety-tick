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
  if(story = $(".ghx-fieldname-issuekey a")){
    var title = $("[data-field-id='summary']").text();
    var id = story.text();

    var translate = {
      "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss"
    };

    var commitMessage = "[" +  id + "] " + title;
    storyTitles.push({id: id, title: title});
  }

  return storyTitles;
}
