import {
  $all,
  $has,
  $text,
  $value,
} from './helpers';

// Element classes on GitHub have slightly changed over time.
// To maintain support for some older GitHub Enterprise instances,
// the adapter will attempt different versions of selectors.
export const selectors = {
  default: {
    issuesPage: '.js-check-all-container .js-issue-row.selected',
    issuesPageLabel: '.labels .IssueLabel',
    issuePage: '.js-issues-results .gh-header-number',
    issuePageLabel: '.js-issue-labels .sidebar-labels-style[title="bug"]',
  },
  legacy: {
    issuesPage: '.issues-listing .js-issue-row.selected',
    issuesPageLabel: '.labels .label',
    issuePage: '.issues-listing .gh-header-number',
    issuePageLabel: '.sidebar-labels .label[title="bug"]',
  },
};

async function attempt(doc, selector) {
  // issue list page
  if ($has(selector.issuesPage, doc)) {
    const issues = $all(selector.issuesPage, doc);

    const tickets = issues.map((issue) => {
      const id = $value('input.js-issues-list-check', issue);
      const title = $text('a.js-navigation-open', issue);
      const labels = $all(selector.issuesPageLabel, issue);
      const type = labels.some(l => /bug/i.test(l.textContent)) ? 'bug' : 'feature';

      return { id, title, type };
    });

    return tickets;
  }

  // single issue page
  if ($has(selector.issuePage, doc)) {
    const id = $text('.gh-header-number', doc).replace(/^#/, '');
    const title = $text('.js-issue-title', doc);
    const type = $has(selector.issuePageLabel, doc) ? 'bug' : 'feature';
    const tickets = [{ id, title, type }];
    return tickets;
  }

  // project page
  if ($has('.project-columns .project-card', doc)) {
    const openProjectCardSelector = '.project-columns .project-card[data-card-state=\'["open"]\']';
    const projectCards = $all(openProjectCardSelector, doc);

    const tickets = projectCards.map((card) => {
      const id = JSON.parse(card.dataset.cardTitle).slice(-2, -1)[0];
      const title = $text('a.h5', card);
      const type = JSON.parse(card.dataset.cardLabel).includes('bug')
        ? 'bug'
        : 'feature';

      return { id, title, type };
    });

    return tickets;
  }

  return [];
}

async function scan(loc, doc) {
  const tickets = await attempt(doc, selectors.default);
  if (tickets.length > 0) return tickets;
  return attempt(doc, selectors.legacy);
}

export default scan;
