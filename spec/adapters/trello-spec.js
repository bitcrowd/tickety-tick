import { jsdom } from 'jsdom';

import adapter from '../../src/common/adapters/trello';

const CARD = `
  <div class="card-detail-window">
    <h2 class="card-detail-title-assist">A Trello Card</h2>
  </div>
`;

describe('trello adapter', () => {
  const loc = { host: 'trello.com', pathname: '/c/kkRPwRqw/89-a-trello-card' };

  function doc(body = '') {
    return jsdom(`<html><body>${body}</body></html>`);
  }

  it('returns null if it is on a different page', () => {
    adapter.inspect({ host: 'other.com' }, doc(CARD), (err, res) => {
      expect(err).toBe(null);
      expect(res).toBe(null);
    });
  });

  it('extracts tickets from trello cards', () => {
    const expected = [{ id: '89', title: 'A Trello Card', kind: 'feature' }];
    adapter.inspect(loc, doc(CARD), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });
});
