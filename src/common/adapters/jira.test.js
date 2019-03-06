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
  function loc(host, pathname = '', params = {}) {
    const searchParams = new URLSearchParams(params);
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

  const api = { get: jest.fn() };

  beforeEach(() => {
    api.get.mockReturnValue({ json: () => response });
    client.mockReturnValue(api);
  });

  afterEach(() => {
    api.get.mockReset();
  });

  it('returns null when on a different host', async () => {
    const result = await scan(loc('another-domain.com'));
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });

  it('returns null when no issue is selected', async () => {
    const result = await scan(loc('my-subdomain.atlassian.com'));
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });

  it('extracts tickets from the active sprints tab', async () => {
    const result = await scan(loc('my-subdomain.atlassian.net', '', { selectedIssue: key }));
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it('extracts tickets from the issues tab', async () => {
    const result = await scan(loc('my-subdomain.atlassian.net', `/projects/RC/issues/${key}`, { filter: 'something' }));
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it('extracts tickets when browsing an issue', async () => {
    const result = await scan(loc('my-subdomain.atlassian.net', `/browse/${key}`));
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });
});
