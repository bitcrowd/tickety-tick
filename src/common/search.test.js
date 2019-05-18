import { search } from './search';

import serializable from './utils/serializable-errors';

jest.mock('./utils/serializable-errors', () => error => error.message);

describe('ticket search', () => {
  function mock(result, index) {
    return jest
      .fn()
      .mockName(`adapters[${index}]`)
      .mockReturnValue(result);
  }

  function mocks(results) {
    return results.map(mock);
  }

  const doc = { title: 'dummy document' };
  const loc = { host: 'dummy.org' };

  it('feeds the location and document to every adapter', async () => {
    const adapters = mocks([[], []].map(v => Promise.resolve(v)));

    await search(adapters, loc, doc);

    adapters.forEach((scan) => {
      expect(scan).toHaveBeenCalledWith(loc, doc);
    });
  });

  it('resolves with the aggregated tickets and serializable errors', async () => {
    const tickets0 = [{ id: '0', title: 'true story', type: 'test' }];
    const tickets1 = [{ id: '1', title: 'yep', type: 'test' }];

    const error0 = new Error('test error 0');
    const error1 = new Error('test error 1');

    const adapters = mocks([
      Promise.resolve(tickets0),
      Promise.resolve(tickets1),
      Promise.reject(error0),
      Promise.resolve(null),
      Promise.reject(error1),
    ]);

    const results = await search(adapters, loc, doc);

    expect(results).toEqual({
      tickets: [...tickets0, ...tickets1],
      errors: [error0, error1].map(serializable),
    });
  });
});
