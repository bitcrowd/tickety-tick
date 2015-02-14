function addChromeListener() {
  chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
    if (req.tickets) {
      sendResponse(findOpenTickets());
    }
  });
}

function addFirefoxListener() {
  self.port.on("get-tickets", function getTickets() {
    self.port.emit("tickets", findOpenTickets());
  });
}

function pivotalStories(stories, collapsed) {
  storyTitles = []
  stories.each(function () {
    var story = $(this);
    var title = (collapsed ? story.find('.story_name').text() : story.find('.editor.name').val());
    var id = /story_(\d+)/.exec(story.attr('class'))[1];
    var type = story.find(".story_type .selection").text();
    storyTitles.push({id: id, title: title, type: type})
  });
  return storyTitles;
}

var findOpenTickets = function() {
  if ($(".gh-header-number").length > 0) {
    // Github
    var title = $(".js-issue-title").text();
    var id = $(".gh-header-number").text().substr(1);
    var type = "feature";
    if ($(".sidebar-labels .label[title='bug']").length > 0) {
      type = "bug"
    }
    return [{type: type, title: title, id: id}];
  } else if ((story = $(".ghx-fieldname-issuekey a")).length > 0) {
    // Jira sidebar
    var title = $("[data-field-id='summary']").text();
    var id = story.text();
    return [{id: id, title: title}];
  } else if ((story = $(".aui-page-header-inner .aui-page-header-main")).length > 0) {
    // Jira ticket page
    var title = $("#summary-val", story).text();
    var id = $(".issue-link", story).text();
    return [{id: id, title: title}];
  } else if ($('div.story .selector.selected').length > 0) {
    // Pivotal Tracker selected stories
    var stories = $('div.story .selector.selected').closest('.story');
    return pivotalStories(stories, true);
  } else if ($('div.story .details').length > 0) {
    // Pivotal Tracker opened stories
    var stories = $('div.story .details').closest('.story');
    return pivotalStories(stories, false);
  } else {
    return null;
  }
}

if (bowser.chrome) {
  if (window == top) {
    addChromeListener();
  }
} else if (bowser.firefox) {
  addFirefoxListener();
}

