import {
  $all,
  $has,
  $text,
  $value,
} from './helpers';

async function scan(loc, doc) {
  if ($has('.issues-listing .js-issue-row.selected', doc)) {
    const issues = $all('.issues-listing .js-issue-row.selected', doc);

    const tickets = issues.map((issue) => {
      const id = $value('input.js-issues-list-check', issue);
      const title = $text('a.js-navigation-open', issue);
      const labels = $all('.labels .label', issue);
      const type = labels.some(l => /bug/i.test(l.textContent)) ? 'bug' : 'feature';

      return { id, title, type };
    });

    return tickets;
  }

  if ($has('.issues-listing .gh-header-number', doc)) {
    const id = $text('.gh-header-number', doc).replace(/^#/, '');
    const title = $text('.js-issue-title', doc);
    const type = $has('.sidebar-labels .label[title="bug"]', doc) ? 'bug' : 'feature';
    const tickets = [{ id, title, type }];
    return tickets;
  }

  // github project
  if ($has('.project-columns .project-card', doc)) {
    const openProjectCardSelector = '.project-columns .project-card[data-card-state=\'["open"]\']';
    const projectCards = $all(openProjectCardSelector, doc);

    const tickets = projectCards.map((card) => {
      const id = JSON.parse(card.dataset.cardTitle).slice(-2, -1)[0];
      const title = $text('a.h5', card);
      const type = JSON.parse(card.dataset.cardLabel).includes('bug') ? 'bug' : 'feature';

      return { id, title, type };
    });

    return tickets;
  }

  return [];
}

export default scan;
