import { JSDOM } from 'jsdom';

import scan from './gitlab';

const ISSUEPAGE = `
  <div class="content">
    <div class="issue-details">
      <script id="js-issuable-app-initial-data" type="application/json">
        {&quot;issuableRef&quot;:&quot;#22578&quot;}
      </script>
      <div class="detail-page-description">
        <h2 class="title">A Random GitLab Issue</h2>
      </div>
    </div>
  </div>
`;

const BUGPAGE = `
  <div class="content">
    <div class="issue-details">
      <script id="js-issuable-app-initial-data" type="application/json">
        {&quot;issuableRef&quot;:&quot;#22578&quot;}
      </script>
      <div class="detail-page-description">
        <h2 class="title">A Random GitLab Issue</h2>
      </div>
    </div>
    <aside>
      <div class="issueable-sidebar">
        <div class="block labels">
          <div class="sidebar-collapsed-icon js-sidebar-labels-tooltip" data-container="body" data-placement="left" data-original-title="bug">
            <i aria-hidden="true" data-hidden="true" class="fa fa-tags"></i>
            <span>1</span>
          </div>
        </div>
      </div>
    </aside
  </div>
`;

describe('gitlab adapter', () => {
  function dom(body = '', dataPage = '') {
    const { window } = new JSDOM(`<html><body data-page="${dataPage}">${body}</body></html>`);
    return window.document;
  }

  it('returns null if it is on a different page', async () => {
    const result = await scan(null, dom());
    expect(result).toBe(null);
  });

  it('extracts tickets from issue pages', async () => {
    const result = await scan(null, dom(ISSUEPAGE, 'projects:issues:show'));
    expect(result).toEqual([{ id: '22578', title: 'A Random GitLab Issue', type: 'feature' }]);
  });

  it('recognizes issues labelled as bugs', async () => {
    const result = await scan(null, dom(BUGPAGE, 'projects:issues:show'));
    expect(result).toEqual([{ id: '22578', title: 'A Random GitLab Issue', type: 'bug' }]);
  });
});
