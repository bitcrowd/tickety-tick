import type { ErrorObject } from "../errors";
import { serialize } from "../errors";
import type { Ticket } from "../types";
import Clickup from "./adapters/clickup";
import GitHub from "./adapters/github";
import GitLab from "./adapters/gitlab";
import JiraCloud from "./adapters/jira-cloud";
import JiraServer from "./adapters/jira-server";
import Linear from "./adapters/linear";
import Notion from "./adapters/notion";
import Plane from "./adapters/plane";
import Polarion from "./adapters/polarion";
import Tara from "./adapters/tara";
import Trello from "./adapters/trello";
import defaults from "./defaults";
import type { Adapter } from "./types";

async function attempt(scan: Adapter, url: URL, document: Document) {
  try {
    const result = await scan(url, document);
    const tickets = result.map((data) => ({ ...defaults, ...data }));
    return tickets;
  } catch (error) {
    return error as Error;
  }
}

function aggregate(results: (Ticket[] | Error)[]) {
  return results.reduce<{ tickets: Ticket[]; errors: ErrorObject[] }>(
    ({ tickets, errors }, result) =>
      result instanceof Error
        ? { tickets, errors: errors.concat(serialize(result)) }
        : { errors, tickets: tickets.concat(result) },
    { tickets: [], errors: [] },
  );
}

async function search(adapters: Adapter[], url: URL, document: Document) {
  const scans = adapters.map((scan) => attempt(scan, url, document));
  const results = await Promise.all(scans);
  return aggregate(results);
}

const stdadapters: Adapter[] = [
  GitHub,
  GitLab,
  JiraCloud,
  JiraServer,
  Linear,
  Notion,
  Tara,
  Trello,
  Clickup,
  Plane,
  Polarion,
];

export { search, stdadapters };
export default search.bind(null, stdadapters);
