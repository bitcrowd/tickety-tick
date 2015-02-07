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
  var storyTitles = [];
  var stories = jQuery('div.story .selector.selected').closest('.story');
  var collapsed = true;
  if (stories.length == 0) {
    stories = jQuery('div.story .details').closest('.story');
    collapsed = false;
  }
  stories.each(function () {
    var story = jQuery(this);
    var title = (collapsed ? story.find('.story_name').text() : story.find('.editor.name').val());
    var id = /story_(\d+)/.exec(story.attr('class'))[1];
    var type = story.find(".story_type .selection").text();
    storyTitles.push({id: id, title: title, type: type})
  });
  return storyTitles;
}
