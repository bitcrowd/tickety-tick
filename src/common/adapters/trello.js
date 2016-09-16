/* global $$$ */

const trim = (s) => s.replace(/^\s+|\s+$/g, '');
const has = (sel, ctx) => $$$(sel, ctx).length > 0;
const txt = (sel, ctx) => trim($$$(sel, ctx).text());

const adapter = {
  inspect(loc, doc, fn) {
    if (loc.host !== 'trello.com') return fn(null, null);
    if (!has('.card-detail-window', doc)) return fn(null, null);

    const id = loc.pathname.match(/\/([\d]+)-[^/]+$/)[1];
    const title = txt('.card-detail-title-assist', doc);
    const type = 'feature';

    const tickets = [{ id, title, type }];

    return fn(null, tickets);
  }
};

export default adapter;
