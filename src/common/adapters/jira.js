import { $find, $has, $text, $attr } from './helpers';

const KINDS = ['bug', 'chore'];
const normalizeKind = (kind) => {
  const sanitizedKind = kind && kind.toLowerCase();
  if (KINDS.indexOf(sanitizedKind) > -1) return sanitizedKind;
  return 'feature';
};

const adapter = {
  inspect(loc, doc, fn) {
    if (doc.body.id !== 'jira') return fn(null, null);

    if ($has('.ghx-fieldname-issuekey a', doc)) { // JIRA sidebar
      const id = $text('.ghx-fieldname-issuekey a', doc);
      const title = $text('[data-field-id="summary"]', doc);
      const kind = normalizeKind($attr(`[data-issue-key="${id}"] .ghx-type`, doc, 'title'));
      return fn(null, [{ id, title, kind }]);
    } else if ($has('#issue-content', doc)) { // JIRA ticket page
      const issue = $find('#issue-content', doc);
      const id = $text('#key-val', issue);
      const title = $text('#summary-val', issue);
      const kind = normalizeKind($text('#type-val', issue));
      return fn(null, [{ id, title, kind }]);
    }

    return fn(null, null);
  }
};

export default adapter;
