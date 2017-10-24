import { $find, $has, $map, $text, $value } from './helpers';

const adapter = {
  inspect(loc, doc, fn) {
    if ($has('.issues-listing .js-issue-row.selected', doc)) {
      const issues = $find('.issues-listing .js-issue-row.selected', doc);

      const tickets = $map(issues, (i, issue) => {
        const id = $value('input.js-issues-list-check', issue);
        const title = $text('a.js-navigation-open', issue);
        const type = $has('.labels .label:contains(bug)', issue) ? 'bug' : 'feature';

        return { id, title, type };
      });

      return fn(null, tickets);
    }

    if ($has('.issues-listing .gh-header-number', doc)) {
      const id = $text('.gh-header-number', doc).replace(/^#/, '');
      const title = $text('.js-issue-title', doc);
      const type = $has('.sidebar-labels .label[title="bug"]', doc) ? 'bug' : 'feature';
      const tickets = [{ id, title, type }];
      return fn(null, tickets);
    }

    // github project
    if ($has('.project-columns .project-card', doc)) {
      const openProjectCardSelector = '.project-columns .project-card[data-card-state=\'["open"]\']';
      const projectCards = $find(openProjectCardSelector, doc);

      const tickets = $map(projectCards, (_, card) => {
        const id = JSON.parse(card.dataset.cardTitle).slice(-2, -1)[0];
        const title = $text('a.h5', card);
        const type = JSON.parse(card.dataset.cardLabel).includes('bug') ? 'bug' : 'feature';

        return { id, title, type };
      });

      return fn(null, tickets);
    }

    return fn(null, null);
  },
};

export default adapter;
