import $ from 'jquery';

// TODO: remove jquery?

const trim = (s) => s.replace(/^\s+|\s+$/g, '');
const has = (sel, ctx) => $(sel, ctx).length > 0;
const txt = (sel, ctx) => trim($(sel, ctx).text());

const adapter = {
  inspect(doc, fn) {
    if (has('.ghx-fieldname-issuekey a', doc)) { // JIRA sidebar
      // TODO: check what this looks like in JIRA, update tests, find better selectors
      const id = txt('.ghx-fieldname-issuekey a', doc);
      const title = txt('[data-field-id=\'summary\']', doc);
      return fn(null, [{ id, title }]);
    } else if (has('#issue-content', doc)) { // JIRA ticket page
      const issue = $('#issue-content', doc);
      const id = txt('#key-val', issue);
      const title = txt('#summary-val', issue);
      return fn(null, [{ id, title }]);
    }

    return fn(null, null);
  }
};

export default adapter;
