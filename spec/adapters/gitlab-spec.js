import { jsdom } from 'jsdom';

import adapter from '../../src/common/adapters/gitlab';

const ISSUEPAGE = `
  <div class="content">
    <div class="detail-page-header">
      <div class="issuable-meta">
        <strong class="identifier">Issue #22578</strong>
      </div>
    </div>
    <div class="issue-details">
      <div class="detail-page-description">
        <h2 class="title">A Random GitLab Issue</h2>
      </div>
    </div>
  </div>
`;

const BUGPAGE = `
`;

describe('gitlab adapter', () => {
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
    const expected = [{ id: '22578', title: 'A Random GitLab Issue', kind: 'feature' }];
    adapter.inspect(null, dom(ISSUEPAGE), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });

  xit('recognizes issues labelled as bugs', () => {
    const expected = [{ id: '12', title: 'A Random GitHub Issue', kind: 'bug' }];
    adapter.inspect(null, dom(BUGPAGE), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });
});
