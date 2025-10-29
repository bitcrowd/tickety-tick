/**
 * Jira Server adapter
 *
 * This adapter is for self-hosted jira instances and uses the old v2 rest API for fetching tickets.
 *
 * The adapter extracts the identifier of the selected issue from the page URL
 * and uses the Jira API to retrieve the corresponding ticket information.
 *
 * https://my-jira.org/server/jira/platform/rest-apis/
 *
 * Supported page URLs:
 * - Backlog and Active Sprints: https://<YOURDOMAIN>/secure/RapidBoard.jspa?…&selectedIssue=<ISSUE-KEY>
 * - Issues and filters: https://<YOUR-DOMAIN>/projects/<PROJECT-KEY>/issues/<ISSUE-KEY>
 * - Issue view: https://<YOUR-DOMAIN>/browse/<ISSUE-KEY>
 */

import { match } from "micro-match";

import client from "../client";
import type { TicketData } from "../types";

type JiraTicketInfo = {
  key: string;
  fields: {
    issuetype: { name: string };
    summary: string;
    description: string;
  };
};

function isJiraPage(_url: URL, document: Document) {
  if (document.body.id === "jira") return true;
  return false;
}

const pathSuffixes =
  /\/(browse\/[^/]+|projects\/[^/]+\/issues\/[^/]+|secure\/RapidBoard\.jspa|jira\/software\/([^/]\/)*projects\/[^/]+\/boards\/.*)$/g;

function getPathPrefix(url: URL) {
  return url.pathname.replace(pathSuffixes, "");
}

function getSelectedIssueId(url: URL, prefix = "") {
  const { searchParams: params } = new URL(url.href);

  if (params.has("selectedIssue")) return params.get("selectedIssue");

  const path = url.pathname.substring(prefix.length); // strip path prefix

  return ["/projects/:project/issues/:id", "/browse/:id"]
    .map((pattern) => match(pattern, path).id)
    .find(Boolean);
}

function extractTicketInfo(info: JiraTicketInfo, host: string) {
  const {
    key: id,
    fields: { issuetype, summary: title, description },
  } = info;
  const type = issuetype.name.toLowerCase();
  const url = `https://${host}/browse/${id}`;

  return {
    type,
    id,
    title,
    description,
    url,
  };
}

async function scan(url: URL, document: Document): Promise<TicketData[]> {
  if (!isJiraPage(url, document)) return [];

  const prefix = getPathPrefix(url); // self-managed instances may host on a subpath

  const id = getSelectedIssueId(url, prefix);

  if (!id) return [];

  const jira = client(`https://${url.host}${prefix}/rest/api/latest`);
  const response = await jira.get(`issue/${id}`).json<JiraTicketInfo>();
  const ticket = extractTicketInfo(response, url.host);

  return [ticket];
}

export default scan;
