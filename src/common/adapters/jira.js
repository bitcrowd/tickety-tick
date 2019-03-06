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

function isJiraPage(loc, doc) {
  if (loc.host.endsWith('.atlassian.net')) return true;
  if (doc.body.id === 'jira') return true;
  return false;
}

function getSelectedIssueId({ href, pathname }) {
  const { searchParams: params } = new URL(href);

  if (params.has('selectedIssue')) return params.get('selectedIssue');

  return ['/projects/:project/issues/:id', '/browse/:id']
    .map(pattern => match(pattern, pathname).id)
    .find(Boolean);
}

function extractTicketInfo(response) {
  const { key: id, fields: { issuetype, summary: title } } = response;
  const type = issuetype.name.toLowerCase();
  return { id, title, type };
}

async function scan(loc, doc) {
  if (!isJiraPage(loc, doc)) return null;

  const id = getSelectedIssueId(loc);

  if (!id) return null;

  const jira = client(`https://${host}/rest/api/latest`);
  const response = await jira.get(`issue/${id}`).json();
  const ticket = extractTicketInfo(response);

  return [ticket];
}

export default scan;
