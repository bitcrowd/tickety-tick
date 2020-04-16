/**
 * Jira adapter
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

import { match } from 'micro-match';

import client from '../client';

function isJiraPage(loc, doc) {
  if (loc.host.endsWith('.atlassian.net')) return true;
  if (doc.body.id === 'jira') return true; // self-managed instance on different domain
  return false;
}

const pathSuffixes = new RegExp(
  '/(browse/[^/]+|projects/[^/]+/issues/[^/]+|secure/RapidBoard.jspa|jira/software/projects/[^/]+/boards/.*)$',
  'g'
);
function getPathPrefix(loc) {
  return loc.pathname.replace(pathSuffixes, '');
}

function getSelectedIssueId(loc, prefix = '') {
  const { searchParams: params } = new URL(loc.href);

  if (params.has('selectedIssue')) return params.get('selectedIssue');

  const path = loc.pathname.substr(prefix.length); // strip path prefix

  return ['/projects/:project/issues/:id', '/browse/:id']
    .map((pattern) => match(pattern, path).id)
    .find(Boolean);
}

function extractTicketInfo(response) {
  const {
    key: id,
    fields: { issuetype, summary: title },
  } = response;
  const type = issuetype.name.toLowerCase();
  return { id, title, type };
}

async function scan(loc, doc) {
  if (!isJiraPage(loc, doc)) return [];

  const prefix = getPathPrefix(loc); // self-managed instances may host on a subpath

  const id = getSelectedIssueId(loc, prefix);

  if (!id) return [];

  const jira = client(`https://${loc.host}${prefix}/rest/api/latest`);
  const response = await jira.get(`issue/${id}`).json();
  const ticket = extractTicketInfo(response);

  return [ticket];
}

export default scan;
