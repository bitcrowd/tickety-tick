import GitHub from './adapters/github';
import GitLab from './adapters/gitlab';
import Jira from './adapters/jira';
import Ora from './adapters/ora';
import Pivotal from './adapters/pivotal';
import Trello from './adapters/trello';

export const stdadapters = [GitHub, GitLab, Jira, Ora, Pivotal, Trello];

export function search(adapters, loc, doc, fn) {
  let pending = adapters.length;
  const results = [];

  function done() {
    const res = results.find(e => (e !== null));
    fn(res || null);
  }

  adapters.forEach((adapter, i) => {
    adapter.inspect(loc, doc, (err, res) => {
      if (err) console.error(err); // eslint-disable-line no-console

      results[i] = err ? null : res;
      pending -= 1;

      if (pending === 0) done();
    });
  });
}

export default search.bind(null, stdadapters);
