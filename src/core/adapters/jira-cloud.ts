/**
 * Jira Cloud adapter
 *
 * This adapter is for cloud-hosted Jira and uses the v3 rest API for fetching tickets.
 *
 * The adapter extracts the identifier of the selected issue from the page URL
 * and uses the Jira API to retrieve the corresponding ticket information.
 *
 * https://developer.atlassian.com/server/jira/platform/rest-apis/
 *
 * Supported page URLs:
 * - Backlog and Active Sprints: https://<YOUR-SUBDOMAIN>.atlassian.net/secure/RapidBoard.jspa?…&selectedIssue=<ISSUE-KEY>
 * - Issues and filters: https://<YOUR-SUBDOMAIN>.atlassian.net/projects/<PROJECT-KEY>/issues/<ISSUE-KEY>
 * - Issue view: https://<YOUR-SUBDOMAIN>.atlassian.net/browse/<ISSUE-KEY>
 */

import { fromADF } from "mdast-util-from-adf";
import { gfmToMarkdown } from "mdast-util-gfm";
import { toMarkdown } from "mdast-util-to-markdown";
import { match } from "micro-match";

import client from "../client";
import type { TicketData } from "../types";

type JiraTicketInfo = {
  key: string;
  fields: {
    issuetype: { name: string };
    summary: string;
    description: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};

function isJiraPage(url: URL) {
  if (url.host.endsWith(".atlassian.net")) return true;
  return false;
}

function getSelectedIssueId(url: URL) {
  const { searchParams: params } = new URL(url.href);

  if (params.has("selectedIssue")) return params.get("selectedIssue");

  const path = url.pathname.replace(/^\/jira\/software/, "");

  return ["/projects/:project/issues/:id", "/browse/:id"]
    .map((pattern) => match(pattern, path).id)
    .find(Boolean);
}

function extractTicketInfo(info: JiraTicketInfo, host: string) {
  const { key: id, fields } = info;
  const { issuetype, summary: title } = fields;

  const type = issuetype.name.toLowerCase();
  const url = `https://${host}/browse/${id}`;
  const description = fields.description
    ? toMarkdown(fromADF(fields.description), { extensions: [gfmToMarkdown()] })
    : undefined;

  return {
    type,
    id,
    title,
    description,
    url,
  };
}

async function scan(url: URL): Promise<TicketData[]> {
  if (!isJiraPage(url)) return [];

  const id = getSelectedIssueId(url);

  if (!id) return [];

  const jira = client(`https://${url.host}/rest/api/3`);
  const response = await jira.get(`issue/${id}`).json<JiraTicketInfo>();
  const ticket = extractTicketInfo(response, url.host);

  return [ticket];
}

export default scan;
