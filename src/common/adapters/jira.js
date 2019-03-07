// Jira adapter
//
// This adapter extracts the identifier of the selected issue from the page URL
// and uses the Jira API to retrieve the corresponding ticket information.
//
// https://developer.atlassian.com/server/jira/platform/rest-apis/
//
// * Backlog and Active Sprints: https://<YOUR-SUBDOMAIN>.atlassian.net/secure/RapidBoard.jspa?…&selectedIssue=<ISSUE-KEY>
// * Issues and filters: https://<YOUR-SUBDOMAIN>.atlassian.net/projects/<PROJECT-KEY>/issues/<ISSUE-KEY>
// * Issue view: https://<YOUR-SUBDOMAIN>.atlassian.net/browse/<ISSUE-KEY>

import match from 'micro-match';

import client from '../client';

const DOMAIN = '.atlassian.net';

const issueTabMatch = '/projects/:project/issues/:id';
const browseIssueMatch = '/browse/:id';

function selectedIssue({ href, pathname }) {
  let id = null;

  const { searchParams: params } = new URL(href);
  id = params.get('selectedIssue');
  if (id) return id;

  ({ id } = { ...match(issueTabMatch, pathname), ...match(browseIssueMatch, pathname) });

  return id;
}

function extractTicketInfo(response) {
  const { key: id, fields } = response;
  const { issuetype, summary: title } = fields;
  const type = issuetype.name.toLowerCase();

  return { id, title, type };
}

async function scan(loc) {
  const { host } = loc;
  if (!host.endsWith(DOMAIN)) return null;

  const issueKey = selectedIssue(loc);
  if (!issueKey) return null;

  const jira = client(`https://${host}/rest/api/latest`);
  const response = await jira.get(`issue/${issueKey}`).json();
  const ticketInfo = extractTicketInfo(response);

  return [ticketInfo];
}

export default scan;
