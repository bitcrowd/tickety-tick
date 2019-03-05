// JIRA adapter
// It gets the selected issue from the current URL and then it fetches the ticket info
//
// * Backlog and Active Sprints: https://<YOUR-SUBDOMAIN>.atlassian.net/secure/RapidBoard.jspa?…&selectedIssue=<ISSUE-KEY>
// * Issues and filters: https://<YOUR-SUBDOMAIN>.atlassian.net/projects/<PROJECT-KEY>/issues/<ISSUE-KEY>
// * Issue view: https://<YOUR-SUBDOMAIN>.atlassian.net/browse/<ISSUE-KEY>

import client from '../client';

const DOMAIN = '.atlassian.net';

const issuesTabPattern = /^\/projects\/[A-Za-z0-9\-_]+\/issues\/[A-Za-z0-9\-_]+$/;
const browseIssuePattern = /^\/browse\/[A-Za-z0-9\-_]+$/;

function lastSegment(pathname) {
  return pathname.split('/').slice(-1)[0];
}

function selectedIssue({ href, pathname }) {
  if (issuesTabPattern.test(pathname) || browseIssuePattern.test(pathname)) {
    return lastSegment(pathname);
  }

  const { searchParams: params } = new URL(href);
  const issueKey = params.get('selectedIssue');
  if (issueKey) return issueKey;

  return null;
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

  const jira = client(`https://${host}/rest/agile/1.0`);
  const response = await jira.get(`issue/${issueKey}`).json();
  const ticketInfo = extractTicketInfo(response);

  return [ticketInfo];
}

export default scan;
