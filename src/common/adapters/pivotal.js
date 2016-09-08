import $ from 'jquery';

// TODO: remove jquery?

const trim = (s) => s.replace(/^\s+|\s+$/g, '');
const has = (sel, ctx) => $(sel, ctx).length > 0;
const val = (sel, ctx) => trim($(sel, ctx).val());
const txt = (sel, ctx) => trim($(sel, ctx).text());

const cls = (ctx) => ['bug', 'chore', 'feature', 'release']
  .find((c) => ctx.hasClass(c));

function multiple(elements, collapsed) {
  return elements.map(function extract() {
    const story = $(this);

    const id = story.data('id').toString();

    const title = collapsed
      ? txt('.story_name', story)
      : val('.editor.name', story);

    const type = cls(story);

    return { id, title, type };
  }).get();
}

const adapter = {
  inspect(loc, doc, fn) {
    if (doc.body.id !== 'tracker') return fn(null, null);

    if (has('div.story .selector.selected', doc)) { // selected stories
      const selection = $('div.story .selector.selected', doc).closest('.story');
      const tickets = multiple(selection, true);
      return fn(null, tickets);
    } else if (has('div.story .details', doc)) { // opened stories
      const opened = $('div.story .details', doc).closest('.story');
      const tickets = multiple(opened, false);
      return fn(null, tickets);
    } else if (has('.story.maximized', doc)) { // single story in separate tab
      const story = $('.story.maximized', doc);
      const id = val('aside input.id', story).replace(/^#/, '');
      const title = txt('.editor.name', story);
      const type = cls(story);
      const tickets = [{ id, title, type }];
      return fn(null, tickets);
    }

    return fn(null, null);
  }
};

export default adapter;
