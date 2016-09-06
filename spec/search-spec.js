import { search } from '../src/common/search';

describe('ticket search', () => {
  function mocks(results) {
    return results.map((result, i) => {
      const adapter = jasmine.createSpyObj(`adapter(${i})`, ['inspect']);
      adapter.inspect.and.callFake((doc, fn) => { fn(null, result); });
      return adapter;
    });
  }

  const dummydoc = { title: 'dummy document' };

  it('feeds the document to every adapter', (done) => {
    const adapters = mocks([null, null]);

    search(adapters, dummydoc, () => {
      adapters.forEach((adapter) => {
        expect(adapter.inspect).toHaveBeenCalledWith(dummydoc, jasmine.any(Function));
      });

      done();
    });
  });

  it('invokes the callback with the first non-null adapter result', (done) => {
    const result = [{ id: '1', title: 'true story' }];
    const adapters = mocks([null, result]);

    search(adapters, dummydoc, (res) => {
      expect(res).toBe(result);
      done();
    });
  });

  it('invokes the callback with null when no adapter created any results', (done) => {
    const adapters = mocks([null, undefined]);

    search(adapters, dummydoc, (res) => {
      expect(res).toBe(null);
      done();
    });
  });
});
