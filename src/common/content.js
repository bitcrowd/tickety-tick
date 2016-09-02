import $ from 'jquery';

// TODO: modularize id-finding code for jira, pivotal, trello, github etc.
// TODO: remove jquery

function pivotalStories(stories, collapsed) {
  const storyTitles = [];

  stories.each(function fn() {
    const story = $(this);
    const id = /story_(\d+)/.exec(story.attr('class'))[1];
    const title = (collapsed ? story.find('.story_name').text() : story.find('.editor.name').val());
    const classes = story.attr('class').split(' ');

    let type;

    if (classes.indexOf('bug') > 0) {
      type = 'bug';
    } else if (classes.indexOf('chore') > 0) {
      type = 'chore';
    } else if (classes.indexOf('feature') > 0) {
      type = 'feature';
    } else if (classes.indexOf('release') > 0) {
      type = 'release';
    }

    storyTitles.push({ id, title, type });
  });

  return storyTitles;
}

function findOpenTickets() {
  let story;

  if ($('.gh-header-number').length > 0) {
    // Github
    const title = $('.js-issue-title').text();
    const id = $('.gh-header-number').text().substr(1);
    let type = 'feature';
    if ($('.sidebar-labels .label[title=\'bug\']').length > 0) {
      type = 'bug';
    }
    return [{ type, title, id }];
  } else if ((story = $('.ghx-fieldname-issuekey a')).length > 0) {
    // Jira sidebar
    const title = $('[data-field-id=\'summary\']').text();
    const id = story.text();
    return [{ id, title }];
  } else if ((story = $('.aui-page-header-inner .aui-page-header-main')).length > 0) {
    // Jira ticket page
    const title = $('#summary-val', story).text();
    const id = $('.issue-link', story).text();
    return [{ id, title }];
  } else if ($('div.story .selector.selected').length > 0) {
    // Pivotal Tracker selected stories
    const stories = $('div.story .selector.selected').closest('.story');
    return pivotalStories(stories, true);
  } else if ($('div.story .details').length > 0) {
    // Pivotal Tracker opened stories
    const stories = $('div.story .details').closest('.story');
    return pivotalStories(stories, false);
  } else if ($('#tracker .story .name textarea').length > 0) {
    // Pivotal Tracker one story in separate tab
    const id = $('#tracker aside input.id').val();
    const title = $('#tracker .story .name textarea').text();
    const type = $('#tracker aside .story_type .selection').text();
    return [{ id, title, type }];
  }

  return null;
}

export { findOpenTickets };
