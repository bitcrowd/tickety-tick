/* global $, bowser, chrome, safari */

function addChromeListener() {
  chrome.extension.onRequest.addListener(function (req, sender, sendResponse) {
    if (req.tickets) {
      sendResponse(findOpenTickets());
    }
  });
}

function addFirefoxListener() {
  self.port.on('get-tickets', function getTickets() {
    self.port.emit('tickets', findOpenTickets());
  });
}

function handleSafariMessage(msgEvent) {
  if (window.top === window) {
    if (msgEvent.name === 'get-tickets') {
      setTimeout(function () {
        safari.self.tab.dispatchMessage('tickets', findOpenTickets());
      }, 10);
    }
  }
}

function addSafariListener() {
  safari.self.addEventListener('message', handleSafariMessage, false);
}

function pivotalStories(stories, collapsed) {
  var storyTitles = [];
  stories.each(function () {
    var story = $(this);
    var title = (collapsed ? story.find('.story_name').text() : story.find('.editor.name').val());
    var id = /story_(\d+)/.exec(story.attr('class'))[1];
    var classes = story.attr('class').split(' ');
    var type;
    if (classes.indexOf('bug') > 0) {
      type = 'bug';
    } else if (classes.indexOf('chore') > 0) {
      type = 'chore';
    } else if (classes.indexOf('feature') > 0) {
      type = 'feature';
    } else if (classes.indexOf('release') > 0) {
      type = 'release';
    }
    storyTitles.push({ id: id, title: title, type: type });
  });
  return storyTitles;
}

function findOpenTickets() {
  var id;
  var stories;
  var story;
  var title;
  var type;

  if ($('.gh-header-number').length > 0) {
    // Github
    title = $('.js-issue-title').text();
    id = $('.gh-header-number').text().substr(1);
    type = 'feature';
    if ($('.sidebar-labels .label[title=\'bug\']').length > 0) {
      type = 'bug';
    }
    return [{ type: type, title: title, id: id }];
  } else if ((story = $('.ghx-fieldname-issuekey a')).length > 0) {
    // Jira sidebar
    title = $('[data-field-id=\'summary\']').text();
    id = story.text();
    return [{ id: id, title: title }];
  } else if ((story = $('.aui-page-header-inner .aui-page-header-main')).length > 0) {
    // Jira ticket page
    title = $('#summary-val', story).text();
    id = $('.issue-link', story).text();
    return [{ id: id, title: title }];
  } else if ($('div.story .selector.selected').length > 0) {
    // Pivotal Tracker selected stories
    stories = $('div.story .selector.selected').closest('.story');
    return pivotalStories(stories, true);
  } else if ($('div.story .details').length > 0) {
    // Pivotal Tracker opened stories
    stories = $('div.story .details').closest('.story');
    return pivotalStories(stories, false);
  } else if ($('#tracker .story .name textarea').length > 0) {
    // Pivotal Tracker one story in separate tab
    id = $('#tracker aside input.id').val();
    title = $('#tracker .story .name textarea').text();
    type = $('#tracker aside .story_type .selection').text();
    return [{ id: id, title: title, type: type }];
  }
  return null;
}

if (bowser.chrome) {
  if (window === top) {
    addChromeListener();
  }
} else if (bowser.firefox) {
  addFirefoxListener();
} else if (bowser.safari) {
  addSafariListener();
}

