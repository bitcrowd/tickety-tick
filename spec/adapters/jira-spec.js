import { JSDOM } from 'jsdom';

import adapter from '../../src/common/adapters/jira';

const SIDEBAR = `
  <div>
    <div class="ghx-fieldname-issuekey">
      <a href="#">UXPL-39</a>
    </div>
    <div data-field-id="summary">A Random JIRA Sidebar Issue</div>
    <div data-issue-key="UXPL-39">
      <span class="ghx-type" title="Story"></span>
    </div>
  </div>
`;
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

const STORYPAGE_TITLE_EDITED = `
  <div id="issue-content">
    <div class="issue-header-content">
      <a class="issue-link" data-issue-key="UXPL-39" id="key-val">UXPL-39</a>
      <h1 id="summary-val" class="editable-field active">
        <form id="summary-form">
          <textarea id="summary">A Random JIRA Issue</textarea>
          <button type="submit">Save</button>
            <button type="cancel">Cancel</button>
        </form>
      </h1>
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

const BOARD_STORY = `
<div class="ghx-columns">
  <div class="ghx-column">
    <div class="ghx-issue ghx-selected">
      <section class="ghx-summary" title="">A Random JIRA Board Issue</section>
      <section class="ghx-extra-fields">
        <div class="ghx-row"><span class="ghx-extra-field ghx-fa"><span class="ghx-extra-field-content">None</span></span></div>
      </section>
      <section class="ghx-stat-fields">
        <div class="ghx-row ghx-stat-1">
          <span class="ghx-field ghx-field-icon" data-tooltip="Story"><img src=""></span>
          <span class="ghx-field ghx-field-icon" data-tooltip="Some other thing"><img src=""></span>
          <span class="ghx-field"></span><span class="ghx-field"><img src="" class="ghx-avatar-img"></span></div>
      <div class="ghx-row ghx-stat-2">
          <span class="ghx-field"><img src="" class="ghx-avatar-img"></span>
          <a href="/browse/UXPL-39" aria-label="UXPL-39" data-tooltip="UXPL-39" tabindex="-1" class="ghx-key">
            <span class="ghx-issuekey-pkey js-key-link" aria-hidden="true">UXPL</span>
            <span class="ghx-issuekey-number js-key-link" aria-hidden="true">39-</span>
          </a>
        </div>
      </section>
    </div>
  </div>
</div>
`;

const BOARD_CHORE = BOARD_STORY.replace(/Story/gi, 'Chore');
const BOARD_BUG = BOARD_STORY.replace(/Story/gi, 'Bug');

describe('jira adapter', () => {
  function doc(body = '', id = 'jira') {
    const { window } = new JSDOM(`<html><body id="${id}">${body}</body></html>`);
    return window.document;
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

  it('extracts story tickets from a ticket page even when the title is being edited', () => {
    const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Issue', type: 'feature' }];
    adapter.inspect(null, doc(STORYPAGE_TITLE_EDITED), (err, res) => {
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

  it('extracts selected tickets from the board', () => {
    const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Board Issue', type: 'feature' }];
    adapter.inspect(null, doc(BOARD_STORY), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });

  it('extracts selected bug tickets from the board', () => {
    const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Board Issue', type: 'bug' }];
    adapter.inspect(null, doc(BOARD_BUG), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });

  it('extracts selected chore tickets from the board', () => {
    const expected = [{ id: 'UXPL-39', title: 'A Random JIRA Board Issue', type: 'chore' }];
    adapter.inspect(null, doc(BOARD_CHORE), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });
});
