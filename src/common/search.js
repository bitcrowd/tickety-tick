import GitHub from './adapters/github';
import Jira from './adapters/jira';
import Pivotal from './adapters/pivotal';
import Trello from './adapters/trello';

const stdadapters = [GitHub, Jira, Pivotal, Trello];

function search(adapters, doc, fn) {
  let pending = adapters.length;
  const results = [];

  function done() {
    const res = results.find((e) => (e !== null));
    fn(res || null);
  }

  adapters.forEach((adapter, i) => {
    adapter.inspect(doc, (err, res) => {
      if (err) console.error(err); // eslint-disable-line no-console
      results[i] = err ? null : res;
      if (--pending === 0) done();
    });
  });
}

export { search, stdadapters };
export default (doc, fn) => search(stdadapters, doc, fn);
