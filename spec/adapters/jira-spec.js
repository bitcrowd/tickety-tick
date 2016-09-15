import { jsdom } from 'jsdom';

import adapter from '../../src/common/adapters/jira';

// const SIDEBAR = ``;

const TICKETPAGE = `
  <div id="issue-content">
    <div class="issue-header-content">
      <a class="issue-link" data-issue-key="UXPL-39" id="key-val">UXPL-39</a>
      <h1 id="summary-val">A Random JIRA Issue</h1>
    </div>
  </div>
`;

describe('jira adapter', () => {
  function doc(body = '', id = 'jira') {
    return jsdom(`<html><body id="${id}">${body}</body></html>`);
  }

  it('returns null if it is on a different page', () => {
    adapter.inspect(null, doc(TICKETPAGE, 'foo'), (err, res) => {
      expect(err).toBe(null);
      expect(res).toBe(null);
    });
  });

  it('extracts tickets from a ticket page', () => {
    const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Issue' }];
    adapter.inspect(null, doc(TICKETPAGE), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });

  it('extracts tickets from the sidebar');
});
