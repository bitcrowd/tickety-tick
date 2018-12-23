import GitHub from './adapters/github';
import GitLab from './adapters/gitlab';
import Jira from './adapters/jira';
import Ora from './adapters/ora';
import Pivotal from './adapters/pivotal';
import Trello from './adapters/trello';

export const stdadapters = [GitHub, GitLab, Jira, Ora, Pivotal, Trello];

export async function search(adapters, loc, doc) {
  const results = await Promise.all(adapters.map(scan => scan(loc, doc)));
  return results.find(e => (e !== null)) || null;
}

export default search.bind(null, stdadapters);
