import { jsdom } from 'jsdom';

import adapter from '../../src/common/adapters/jira';

const SIDEBAR = `<div>
  <div class="ghx-fieldname-issuekey">
    <a href="#">UXPL-39</a>
  </div>
  <div data-field-id="summary">A Random JIRA Sidebar Issue</div>
  <div data-issue-key="UXPL-39">
    <span class="ghx-type" title="Story"></span>
  </div>
</div>`;
const BUG_SIDEBAR = SIDEBAR.replace(/Story/, 'Bug');
const CHORE_SIDEBAR = SIDEBAR.replace(/Story/, 'Chore');

const STORYPAGE = `
  <div id="issue-content">
    <div class="issue-header-content">
      <a class="issue-link" data-issue-key="UXPL-39" id="key-val">UXPL-39</a>
      <h1 id="summary-val">A Random JIRA Issue</h1>
    </div>
    <div class="issue-body-content">
      <span id="type-val" class="value editable-field inactive">
        <img alt="" src="/" title="Story - A story"> Story
      </span>
    </div>
  </div>
`;
const CHOREPAGE = STORYPAGE.replace(/Story/gi, 'Chore');
const BUGPAGE = STORYPAGE.replace(/Story/gi, 'Bug');

describe('jira adapter', () => {
  function doc(body = '', id = 'jira') {
    return jsdom(`<html><body id="${id}">${body}</body></html>`);
  }

  it('returns null if it is on a different page', () => {
    adapter.inspect(null, doc(STORYPAGE, 'foo'), (err, res) => {
      expect(err).toBe(null);
      expect(res).toBe(null);
    });
  });

  it('extracts story tickets from a ticket page', () => {
    const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Issue', type: 'feature' }];
    adapter.inspect(null, doc(STORYPAGE), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });

  it('extracts bug tickets from a ticket page', () => {
    const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Issue', type: 'bug' }];
    adapter.inspect(null, doc(BUGPAGE), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });

  it('extracts chore tickets from a ticket page', () => {
    const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Issue', type: 'chore' }];
    adapter.inspect(null, doc(CHOREPAGE), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });

  it('extracts tickets from the sidebar', () => {
    const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Sidebar Issue', type: 'feature' }];
    adapter.inspect(null, doc(SIDEBAR), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });

  it('extracts bug tickets from the sidebar', () => {
    const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Sidebar Issue', type: 'bug' }];
    adapter.inspect(null, doc(BUG_SIDEBAR), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });

  it('extracts chore tickets from the sidebar', () => {
    const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Sidebar Issue', type: 'chore' }];
    adapter.inspect(null, doc(CHORE_SIDEBAR), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });
});
