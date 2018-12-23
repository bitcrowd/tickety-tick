import { search } from './search';

describe('ticket search', () => {
  function mocks(results) {
    return results.map((result) => {
      const adapter = jest.fn().mockResolvedValue(result);
      return adapter;
    });
  }

  const doc = { title: 'dummy document' };
  const loc = { host: 'dummy.org' };

  it('feeds the location and document to every adapter', async () => {
    const adapters = mocks([null, null]);

    await search(adapters, loc, doc);

    adapters.forEach((scan) => {
      expect(scan).toHaveBeenCalledWith(loc, doc);
    });
  });

  it('invokes the callback with the first non-null adapter result', async () => {
    const result = [{ id: '1', title: 'true story' }];
    const adapters = mocks([null, result]);

    await expect(search(adapters, loc, doc)).resolves.toBe(result);
  });

  it('invokes the callback with null when no adapter created any results', async () => {
    const adapters = mocks([null, undefined]);

    await expect(search(adapters, loc, doc)).resolves.toBe(null);
  });
});
