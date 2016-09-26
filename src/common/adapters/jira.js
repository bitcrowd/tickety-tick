import { $find, $has, $text } from './helpers';

const adapter = {
  inspect(loc, doc, fn) {
    if (doc.body.id !== 'jira') return fn(null, null);

    if ($has('.ghx-fieldname-issuekey a', doc)) { // JIRA sidebar
      // TODO: check what this looks like in JIRA, update tests, find better selectors
      const id = $text('.ghx-fieldname-issuekey a', doc);
      const title = $text('[data-field-id="summary"]', doc);
      return fn(null, [{ id, title }]);
    } else if ($has('#issue-content', doc)) { // JIRA ticket page
      const issue = $find('#issue-content', doc);
      const id = $text('#key-val', issue);
      const title = $text('#summary-val', issue);
      return fn(null, [{ id, title }]);
    }

    return fn(null, null);
  }
};

export default adapter;
