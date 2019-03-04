import Client from '.';

export default function jira(host) {
  const apiBase = `https://${host}/rest/agile/1.0`;
  return new Client(apiBase);
}
