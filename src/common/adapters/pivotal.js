import $ from 'jquery';

// TODO: remove jquery?

const trim = (s) => s.replace(/^\s+|\s+$/g, '');
const has = (sel, doc) => $(sel, doc).length > 0;
const val = (sel, doc) => trim($(sel, doc).val());
const txt = (sel, doc) => trim($(sel, doc).text());

function multiple(elements, collapsed) {
  return elements.map(function inspect() {
    const story = $(this);

    const id = /story_(\d+)/.exec(story.attr('class'))[1];

    const title = collapsed
      ? story.find('.story_name').text()
      : story.find('.editor.name').val();

    const type = ['bug', 'chore', 'feature', 'release']
      .find((c) => story.hasClass(c));

    return { id, title, type };
  });
}

const adapter = {
  inspect(doc, fn) {
    if (has('div.story .selector.selected', doc)) { // selected stories
      const selection = $('div.story .selector.selected', doc).closest('.story');
      const tickets = multiple(selection, true);
      return fn(null, tickets);
    } else if (has('div.story .details', doc)) { // opened stories
      const opened = $('div.story .details', doc).closest('.story');
      const tickets = multiple(opened, false);
      return fn(null, tickets);
    } else if (has('#tracker .story .name textarea', doc)) { // single story in separate tab
      const id = val('#tracker aside input.id', doc);
      const title = txt('#tracker .story .name textarea', doc);
      const type = txt('#tracker aside .story_type .selection', doc);
      const tickets = [{ id, title, type }];
      return fn(null, tickets);
    }

    return fn(null, null);
  }
};

export default adapter;
