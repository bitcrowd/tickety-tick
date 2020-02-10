import { JSDOM } from 'jsdom';

import client from '../client';
import scan from './jira';

import loc from './__helpers__/location';

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

  it('returns an empty array when on a different host', async () => {
    const result = await scan(loc('another-domain.com'), doc);
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('returns null when no issue is selected', async () => {
    const result = await scan(loc('my-subdomain.atlassian.com'), doc);
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('uses the endpoints for the current host', async () => {
    await scan(loc('my-subdomain.atlassian.net', `/browse/${key}`), doc);
    expect(client).toHaveBeenCalledWith('https://my-subdomain.atlassian.net/rest/api/latest');
    expect(api.get).toHaveBeenCalled();
  });

  it('extracts tickets from the active sprints tab', async () => {
    const result = await scan(loc('my-subdomain.atlassian.net', '/', `?selectedIssue=${key}`), doc);
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it('extracts tickets from the issues tab', async () => {
    const result = await scan(loc('my-subdomain.atlassian.net', `/projects/TT/issues/${key}`, { filter: 'something' }), doc);
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it('extracts tickets when browsing an issue', async () => {
    const result = await scan(loc('my-subdomain.atlassian.net', `/browse/${key}`), doc);
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });


  it('extracts tickets from new generation software projects', async () => {
    const result = await scan(loc('my-subdomain.atlassian.net', '/jira/software/projects/TT/boards/8/backlog', `?selectedIssue=${key}`), doc);

    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });


  it('extracts tickets on self-managed instances', async () => {
    const result = await scan(loc('jira.local', `/browse/${key}`), doc);
    expect(client).toHaveBeenCalledWith('https://jira.local/rest/api/latest');
    expect(result).toEqual([ticket]);
  });

  it('extracts tickets on self-managed instances (with path prefix)', async () => {
    const results = await Promise.all([
      scan(loc('jira.local', '/prefix/secure/RapidBoard.jspa', `?selectedIssue=${key}`), doc),
      scan(loc('jira.local', `/prefix/projects/TT/issues/${key}`), doc),
      scan(loc('jira.local', `/prefix/browse/${key}`), doc),
    ]);

    const endpoint = 'https://jira.local/prefix/rest/api/latest';

    expect(client).toHaveBeenNthCalledWith(1, endpoint);
    expect(client).toHaveBeenNthCalledWith(2, endpoint);
    expect(client).toHaveBeenNthCalledWith(3, endpoint);

    expect(results).toEqual([[ticket], [ticket], [ticket]]);
  });
});
