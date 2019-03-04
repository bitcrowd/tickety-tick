// JIRA adapter
// It gets the selected issue from the current URL and then it fetches the ticket info
//
// * Backlog and Active Sprints: https://<YOUR-SUBDOMAIN>.atlassian.net/secure/RapidBoard.jspa?…&selectedIssue=<ISSUE-KEY>
// * Issues and filters: https://<YOUR-SUBDOMAIN>.atlassian.net/projects/<PROJECT-KEY>/issues/<ISSUE-KEY>
// * Issue view: https://<YOUR-SUBDOMAIN>.atlassian.net/browse/<ISSUE-KEY>

import qs from 'qs';

import jira from '../clients/jira';

const DOMAIN = '.atlassian.net';

const issuesTabPattern = /^\/projects\/[A-Za-z0-9\-_]+\/issues\/[A-Za-z0-9\-_]+$/;
const browseIssuePattern = /^\/browse\/[A-Za-z0-9\-_]+$/;

function lastSegment(pathname) {
  return pathname.split('/').slice(-1)[0];
}

function selectedIssue({ pathname, search }) {
  if (issuesTabPattern.test(pathname) || browseIssuePattern.test(pathname)) {
    return lastSegment(pathname);
  }

  const { selectedIssue: issueKey } = search && qs.parse(search, { ignoreQueryPrefix: true });
  if (issueKey) return issueKey;

  return null;
}

async function scan(loc) {
  const { host } = loc;
  if (!host.endsWith(DOMAIN)) return null;

  // Get the selected issue from the query string in the URL
  const issueKey = selectedIssue(loc);
  if (!issueKey) return null;

  const response = await jira(host).request('GET', `issue/${issueKey}`);

  const { key: id, fields } = response;
  const { issuetype, summary: title } = fields;
  const type = issuetype.name.toLowerCase();

  return [{ id, title, type }];
}

export default scan;
