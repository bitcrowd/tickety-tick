import { JSDOM } from 'jsdom';

import scan from './github';

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

const PROJECTPAGE = `
  <div class="project-columns">
    <div class="project-card"
         data-card-state='["open"]'
         data-card-label='["enhancement"]'
         data-card-title='["an","example","feature","ticket","42","#42"]'>
      <a class="h5">An Example Feature Ticket</a>
    </div>
    <div class="project-card"
         data-card-state='["open"]'
         data-card-label='["bug"]'
         data-card-title='["an","example","bug","ticket","43","#43"]'>
      <a class="h5">An Example Bug Ticket</a>
    </div>
    <div class="project-card"
         data-card-state='["closed"]'
         data-card-label='["bug"]'
         data-card-title='["an","example","bug","ticket","which","was","closed","and","should","not","be","found","44","#44"]'>
      <a class="h5">An Example Bug Ticket which was closed and should not be found</a>
    </div>
  </div>
`;

describe('github adapter', () => {
  function dom(body = '') {
    const { window } = new JSDOM(`<html><body>${body}</body></html>`);
    return window.document;
  }

  it('returns an empty array if it is on a different page', async () => {
    const result = await scan(null, dom());
    expect(result).toEqual([]);
  });

  it('extracts tickets from issue pages', async () => {
    const result = await scan(null, dom(ISSUEPAGE));
    expect(result).toEqual([{ id: '12', title: 'A Random GitHub Issue', type: 'feature' }]);
  });

  it('recognizes issues labelled as bugs', async () => {
    const result = await scan(null, dom(BUGPAGE));
    expect(result).toEqual([{ id: '12', title: 'A Random GitHub Issue', type: 'bug' }]);
  });

  it('extracts tickets from issues index pages', async () => {
    const result = await scan(null, dom(INDEXPAGE));
    expect(result).toEqual([{ id: '12', title: 'A Selected GitHub Issue', type: 'bug' }]);
  });

  it('extracts tickets from project pages', async () => {
    const result = await scan(null, dom(PROJECTPAGE));
    expect(result).toEqual([
      { id: '42', title: 'An Example Feature Ticket', type: 'feature' },
      { id: '43', title: 'An Example Bug Ticket', type: 'bug' },
    ]);
  });
});
