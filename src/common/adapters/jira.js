import { $all, $find, $has, $text, $attr } from './helpers';

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

const adapter = {
  inspect(loc, doc, fn) {
    if (doc.body.id !== 'jira') return fn(null, null);

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
    } else if ($has('#issue-content', doc)) {
      // ticket show-page, when a single ticket is opened full-screen
      const issue = $find('#issue-content', doc);
      const id = $text('#key-val', issue);
      const title = ticketPageTitle(issue);
      const type = normalizeType($text('#type-val', issue));
      return fn(null, [{ id, title, type }]);
    } else if ($has('.ghx-columns .ghx-issue.ghx-selected', doc)) {
      // Board view, when a ticket is opened in a modal window
      const issue = $find('.ghx-columns .ghx-issue.ghx-selected', doc);
      const id = $attr('.ghx-key', issue, 'aria-label');
      const title = $text('.ghx-summary', issue);
      const type = normalizeType($attr('.ghx-field-icon', issue, 'data-tooltip'));
      return fn(null, [{ id, title, type }]);
    }
    return fn(null, null);
  },
};

export default adapter;
