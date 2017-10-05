import { jsdom } from 'jsdom';

import adapter from '../../src/common/adapters/github';

const ISSUEPAGE = `
  <div class="issues-listing">
    <h1 class="gh-header-title">
      <span class="js-issue-title">A Random GitHub Issue</span>
      <span class="gh-header-number">#12</span>
    </h1>
  </div>
`;

const BUGPAGE = `
  <div class="issues-listing">
    <h1 class="gh-header-title">
      <span class="js-issue-title">A Random GitHub Issue</span>
      <span class="gh-header-number">#12</span>
    </h1>
    <div class="sidebar-labels">
      <a class="label" title="bug">bug</a>
    </div>
  </div>
`;

const INDEXPAGE = `
  <div class="issues-listing">
    <ul>
      <li id="issue_12" class="js-issue-row selected">
        <input type="checkbox" class="js-issues-list-check" name="issues[]" value="12">
        <a href="/bitcrowd/tickety-tick/issues/12" class="h4 js-navigation-open">
          A Selected GitHub Issue
        </a>
        <span class="labels">
          <a href="#" class="label">bug</a>
        </span>
      </li>
      <li id="issue_11" class="js-issue-row">
        <input type="checkbox" class="js-issues-list-check" name="issues[]" value="11">
        <a href="/bitcrowd/tickety-tick/issues/11" class="h4 js-navigation-open">
          A GitHub Issue
        </a>
        <span class="labels"></span>
      </li>
    </ul>
  </div>
`;

describe('github adapter', () => {
  function dom(body = '') {
    return jsdom(`<html><body>${body}</body></html>`);
  }

  it('returns null if it is on a different page', () => {
    adapter.inspect(null, dom(), (err, res) => {
      expect(err).toBe(null);
      expect(res).toBe(null);
    });
  });

  it('extracts tickets from issue pages', () => {
    const expected = [{ id: '12', title: 'A Random GitHub Issue', kind: 'feature' }];
    adapter.inspect(null, dom(ISSUEPAGE), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });

  it('recognizes issues labelled as bugs', () => {
    const expected = [{ id: '12', title: 'A Random GitHub Issue', kind: 'bug' }];
    adapter.inspect(null, dom(BUGPAGE), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });

  it('extracts tickets from issues index pages', () => {
    const expected = [{ id: '12', title: 'A Selected GitHub Issue', kind: 'bug' }];
    adapter.inspect(null, dom(INDEXPAGE), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });
});
