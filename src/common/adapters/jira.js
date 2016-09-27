import { $find, $has, $text, $attr } from './helpers';

const TYPES = ['bug', 'chore'];
const normalizeType = (type) => {
  const sanitizedType = type && type.toLowerCase();
  if (TYPES.indexOf(sanitizedType) > -1) return sanitizedType;
  return 'feature';
};

const adapter = {
  inspect(loc, doc, fn) {
    if (doc.body.id !== 'jira') return fn(null, null);

    if ($has('.ghx-fieldname-issuekey a', doc)) { // JIRA sidebar
      // TODO: check what this looks like in JIRA, update tests, find better selectors
      const id = $text('.ghx-fieldname-issuekey a', doc);
      const title = $text('[data-field-id="summary"]', doc);
      const type = normalizeType($attr(`[data-issue-key="${id}"] .ghx-type`, doc, 'title'));
      return fn(null, [{ id, title, type }]);
    } else if ($has('#issue-content', doc)) { // JIRA ticket page
      const issue = $find('#issue-content', doc);
      const id = $text('#key-val', issue);
      const title = $text('#summary-val', issue);
      const type = normalizeType($text('#type-val', issue));
      return fn(null, [{ id, title, type }]);
    }

    return fn(null, null);
  }
};

export default adapter;
