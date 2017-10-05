import { $find, $has, $map, $text, $value } from './helpers';

const adapter = {
  inspect(loc, doc, fn) {
    if ($has('.issues-listing .js-issue-row.selected', doc)) {
      const issues = $find('.issues-listing .js-issue-row.selected', doc);

      const tickets = $map(issues, (i, issue) => {
        const id = $value('input.js-issues-list-check', issue);
        const title = $text('a.js-navigation-open', issue);
        const kind = $has('.labels .label:contains(bug)', issue) ? 'bug' : 'feature';

        return { id, title, kind };
      });

      return fn(null, tickets);
    }

    if ($has('.issues-listing .gh-header-number', doc)) {
      const id = $text('.gh-header-number', doc).replace(/^#/, '');
      const title = $text('.js-issue-title', doc);
      const kind = $has('.sidebar-labels .label[title="bug"]', doc) ? 'bug' : 'feature';
      const tickets = [{ id, title, kind }];
      return fn(null, tickets);
    }

    return fn(null, null);
  }
};

export default adapter;
