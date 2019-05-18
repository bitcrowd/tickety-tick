import GitHub from './adapters/github';
import GitLab from './adapters/gitlab';
import Jira from './adapters/jira';
import Ora from './adapters/ora';
import Pivotal from './adapters/pivotal';
import Trello from './adapters/trello';

import serializable from './utils/serializable-errors';

async function attempt(scan, loc, doc) {
  try {
    const tickets = await scan(loc, doc);
    return { tickets };
  } catch (error) {
    return { error: serializable(error) };
  }
}

function aggregate(results) {
  return results.reduce(({ tickets, errors }, result) => ({
    errors: errors.concat(result.error ? [result.error] : []),
    tickets: tickets.concat(result.tickets || []),
  }), { tickets: [], errors: [] });
}

export async function search(adapters, loc, doc) {
  const scans = adapters.map(scan => attempt(scan, loc, doc));
  const results = await Promise.all(scans);
  return aggregate(results);
}

export const stdadapters = [GitHub, GitLab, Jira, Ora, Pivotal, Trello];

export default search.bind(null, stdadapters);
