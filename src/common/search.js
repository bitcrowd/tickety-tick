import GitHub from './adapters/github';
import GitLab from './adapters/gitlab';
import Jira from './adapters/jira';
import Ora from './adapters/ora';
import Pivotal from './adapters/pivotal';
import Trello from './adapters/trello';

export const stdadapters = [GitHub, GitLab, Jira, Ora, Pivotal, Trello];

export function search(adapters, loc, doc, fn) {
  Promise.all(adapters.map(scan => scan(loc, doc)))
    .then(results => results.find(e => (e !== null)))
    .then(result => fn(result || null));
}

export default search.bind(null, stdadapters);
