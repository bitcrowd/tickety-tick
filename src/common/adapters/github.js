import $ from 'jquery';

// TODO: remove jquery?

const trim = (s) => s.replace(/^\s+|\s+$/g, '');
const has = (sel, ctx) => $(sel, ctx).length > 0;
const txt = (sel, ctx) => trim($(sel, ctx).text());
const val = (sel, ctx) => $(sel, ctx).val();

const adapter = {
  inspect(loc, doc, fn) {
    if (has('.issues-listing .js-issue-row.selected', doc)) {
      const issues = $('.issues-listing .js-issue-row.selected', doc);

      const tickets = issues.map(function extract() {
        const issue = $(this);

        const id = val('input.js-issues-list-check', issue);
        const title = txt('a.js-navigation-open', issue);
        const type = has('.labels .label:contains(bug)', issue) ? 'bug' : 'feature';

        return { id, title, type };
      }).get();

      return fn(null, tickets);
    }

    if (has('.issues-listing .gh-header-number', doc)) {
      const id = txt('.gh-header-number', doc).replace(/^#/, '');
      const title = txt('.js-issue-title', doc);
      const type = has('.sidebar-labels .label[title="bug"]', doc) ? 'bug' : 'feature';
      const tickets = [{ id, title, type }];
      return fn(null, tickets);
    }

    return fn(null, null);
  }
};

export default adapter;
