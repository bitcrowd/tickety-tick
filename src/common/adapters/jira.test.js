import { JSDOM } from 'jsdom';

import client from '../client';
import scan from './jira';

jest.mock('../client', () => jest.fn());

const key = 'RC-654';

const response = {
  id: '10959',
  fields: {
    issuetype: { name: 'Story' },
    summary: 'A quick summary of the ticket',
  },
  key,
};

const ticket = {
  id: response.key,
  title: response.fields.summary,
  type: response.fields.issuetype.name.toLowerCase(),
};

describe('jira adapter', () => {
  function loc(host, pathname = '', params = null) {
    const searchParams = new URLSearchParams(params || {});
    const href = params
      ? `https://${host}${pathname}?${searchParams}`
      : `https://${host}${pathname}`;

    return {
      host,
      href,
      pathname,
      search: searchParams.toString(),
    };
  }

  const dom = new JSDOM('<html><body id="jira">…</body"</html>');
  const doc = dom.window.document;

  const api = { get: jest.fn() };

  beforeEach(() => {
    api.get.mockReturnValue({ json: () => response });
    client.mockReturnValue(api);
  });

  afterEach(() => {
    api.get.mockReset();
    client.mockReset();
  });

  it('returns null when on a different host', async () => {
    const result = await scan(loc('another-domain.com'), doc);
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });

  it('returns null when no issue is selected', async () => {
    const result = await scan(loc('my-subdomain.atlassian.com'), doc);
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });

  it('uses the endpoints for the current host', async () => {
    await scan(loc('my-subdomain.atlassian.net', '', { selectedIssue: key }), doc);
    expect(client).toHaveBeenCalledWith('https://my-subdomain.atlassian.net/rest/agile/1.0');
    expect(api.get).toHaveBeenCalled();
  });

  it('extracts tickets from the active sprints tab', async () => {
    const result = await scan(loc('my-subdomain.atlassian.net', '', { selectedIssue: key }), doc);
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it('extracts tickets from the issues tab', async () => {
    const result = await scan(loc('my-subdomain.atlassian.net', `/projects/RC/issues/${key}`, { filter: 'something' }), doc);
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it('extracts tickets when browsing an issue', async () => {
    const result = await scan(loc('my-subdomain.atlassian.net', `/browse/${key}`), doc);
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it('extracts tickets on self-hosted instances', async () => {
    const result = await scan(loc('jira.local', `/browse/${key}`), doc);
    expect(client).toHaveBeenCalledWith('https://jira.local/rest/agile/1.0');
    expect(result).toEqual([ticket]);
  });
});
