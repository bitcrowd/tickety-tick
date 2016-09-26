import GitHub from './adapters/github';
import GitLab from './adapters/gitlab';
import Jira from './adapters/jira';
import Pivotal from './adapters/pivotal';
import Trello from './adapters/trello';

const stdadapters = [GitHub, GitLab, Jira, Pivotal, Trello];

function search(adapters, loc, doc, fn) {
  let pending = adapters.length;
  const results = [];

  function done() {
    const res = results.find((e) => (e !== null));
    fn(res || null);
  }

  adapters.forEach((adapter, i) => {
    adapter.inspect(loc, doc, (err, res) => {
      if (err) console.error(err); // eslint-disable-line no-console
      results[i] = err ? null : res;
      if (--pending === 0) done();
    });
  });
}

export { search, stdadapters };
export default (loc, doc, fn) => search(stdadapters, loc, doc, fn);
