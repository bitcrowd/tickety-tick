import $ from 'jquery';

// TODO: remove jquery?

const trim = (s) => s.replace(/^\s+|\s+$/g, '');
const has = (sel, doc) => $(sel, doc).length > 0;
const txt = (sel, doc) => trim($(sel, doc).text());

const adapter = {
  inspect(doc, fn) {
    if (!has('.gh-header-number', doc)) return fn(null, null);

    const id = txt('.gh-header-number', doc).replace(/^#/, '');
    const title = txt('.js-issue-title', doc);
    const type = has('.sidebar-labels .label[title=\'bug\']', doc) ? 'bug' : 'feature';

    const tickets = [{ id, title, type }];

    return fn(null, tickets);
  }
};

export default adapter;
