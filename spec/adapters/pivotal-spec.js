import { jsdom } from 'jsdom';

import adapter from '../../src/common/adapters/pivotal';

const SELECTION = '';// ``;

describe('pivotal adapter', () => {
  function doc(body = '') {
    return jsdom(`<html><body>${body}</body></html>`);
  }

  xit('extracts tickets from selected stories', () => {
    const expected = [{ id: '1231244', title: 'A Selected Pivotal Story' }];
    adapter.inspect(doc(SELECTION), (err, res) => {
      expect(err).toBe(null);
      expect(res).toEqual(expected);
    });
  });

  it('extracts tickets from opened stories');

  it('extracts tickets from a single opened stories');
});
