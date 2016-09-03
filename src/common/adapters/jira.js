import $ from 'jquery';

// TODO: remove jquery?

const has = (sel, doc) => $(sel, doc).length > 0;
const txt = (sel, doc) => $(sel, doc).text().replace(/^\s+|\s+$/g, '');

const adapter = {
  inspect(doc, fn) {
    if (has('.ghx-fieldname-issuekey a', doc)) { // JIRA sidebar
      const id = txt('.ghx-fieldname-issuekey a', doc);
      const title = txt('[data-field-id=\'summary\']', doc);
      return fn(null, [{ id, title }]);
    } else if (has('.aui-page-header-inner .aui-page-header-main', doc)) { // JIRA ticket page
      const story = $('.aui-page-header-inner .aui-page-header-main', doc);
      const id = txt('.issue-link', story);
      const title = txt('#summary-val', story);
      return fn(null, [{ id, title }]);
    }

    return fn(null, null);
  }
};

export default adapter;
