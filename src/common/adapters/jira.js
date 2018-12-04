import {
  $all,
  $find,
  $has,
  $text,
  $attr,
  trim,
} from './helpers';

const TYPES = ['bug', 'chore'];

const normalizeType = (type) => {
  const sanitizedType = type && type.toLowerCase();
  if (TYPES.indexOf(sanitizedType) > -1) return sanitizedType;
  return 'feature';
};

const ticketPageTitle = (issue) => {
  if ($has('#summary-form', issue)) { // ticket title is currently being edited
    return $text('#summary-form #summary', issue);
  }

  return $text('#summary-val', issue);
};

const ISSUE_PATH = /\/browse\/(.*-\d+)/;
const getIssueIdFromUrl = url => url.match(ISSUE_PATH)[1];

const tryParseBacklogIssue = (anchorNode) => {
  const parent = anchorNode.parentElement;

  if (parent.children[1]) { // There is a title candidate
    const title = trim(parent.children[1].textContent);
    const id = trim(anchorNode.textContent);

    if (!title || title === id) return null; // Some problem

    return { id, title, type: 'feature' };
  }

  return null;
};

const adapter = {
  inspect(loc, doc, fn) {
    if (doc.body.id !== 'jira') return fn(null, null);

    /*
      Old layout
     */
    if ($has('.ghx-backlog-column .ghx-backlog-card.ghx-selected', doc)) {
      // ticket list with backlog and sprints
      const issueCssPath = '.ghx-backlog-column .ghx-backlog-card.ghx-selected';
      const issues = $all(issueCssPath, doc).map((issue) => {
        const id = $text('.ghx-key', issue);
        const title = $text('.ghx-summary .ghx-inner', issue);
        const type = normalizeType($attr('.ghx-type', issue, 'title'));
        return { id, title, type };
      });
      return fn(null, issues);
    }

    if ($has('#issue-content', doc)) {
      // ticket show-page, when a single ticket is opened full-screen
      const issue = $find('#issue-content', doc);
      const id = $text('#key-val', issue);
      const title = ticketPageTitle(issue);
      const type = normalizeType($text('#type-val', issue));
      return fn(null, [{ id, title, type }]);
    }

    if ($has('.ghx-columns .ghx-issue.ghx-selected', doc)) {
      // board view, when a ticket is opened in a modal window
      const issue = $find('.ghx-columns .ghx-issue.ghx-selected', doc);
      const id = $attr('.ghx-key', issue, 'aria-label');
      const title = $text('.ghx-summary', issue);
      const type = normalizeType($attr('.ghx-field-icon', issue, 'data-tooltip'));
      return fn(null, [{ id, title, type }]);
    }

    /*
      New layout
     */
    try {
      // single issue page
      if (ISSUE_PATH.test(loc)) {
        const title = $text('h1', doc);
        const id = getIssueIdFromUrl(loc.toString());
        return fn(null, [{ id, title, type: 'feature' }]);
      }

      // board view with open issue dialog
      if ($has('[role=dialog] a[href*="/browse/"]', doc)) {
        const dialog = $find('[role=dialog]', doc);
        const title = $text('h1', dialog);
        const id = getIssueIdFromUrl($find('a', dialog).href);
        return fn(null, [{ title, id, type: 'feature' }]);
      }

      // backlog view
      const backlogIssues = $all('a[href*="/browse/"]', doc)
        .map(tryParseBacklogIssue)
        .filter(issue => issue !== null);
      if (backlogIssues.length !== 0) {
        return fn(null, backlogIssues);
      }
    } catch (error) {
      return fn(error, null);
    }

    return fn(null, null);
  },
};

export default adapter;
