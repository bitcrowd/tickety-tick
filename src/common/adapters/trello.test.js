import { JSDOM } from 'jsdom';

import scan from './trello';

const CARD = `
  <div class="card-detail-window">
    <h2 class="card-detail-title-assist">A Trello Card</h2>
  </div>
`;

describe('trello adapter', () => {
  const loc = { host: 'trello.com', pathname: '/c/kkRPwRqw/89-a-trello-card' };

  function doc(body = '') {
    const { window } = new JSDOM(`<html><body>${body}</body></html>`);
    return window.document;
  }

  it('returns null if it is on a different page', async () => {
    const result = await scan({ host: 'other.com' }, doc(CARD));
    expect(result).toBe(null);
  });

  it('extracts tickets from trello cards', async () => {
    const result = await scan(loc, doc(CARD));
    expect(result).toEqual([{ id: '89', title: 'A Trello Card', type: 'feature' }]);
  });
});
