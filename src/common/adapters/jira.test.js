import client from '../client';
import scan from './jira';

jest.mock('../client', () => jest.fn());

const selectedIssue = 'RC-654';
const issueType = 'Story';
const title = 'A quick summary of the ticket';

const response = {
  id: '10959',
  key: selectedIssue,
  fields: {
    issuetype: {
      name: issueType,
    },
    summary: title,
  },
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

  it('returns null when the selected issue is missing', async () => {
    const result = await scan(loc('my-subdomain.atlassian.com'));
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });

  it('extracts tickets from the active sprints tab', async () => {
    const result = await scan(loc('my-subdomain.atlassian.net', '', { selectedIssue }));

    expect(api.get).toHaveBeenCalledWith(`issue/${selectedIssue}`);
    expect(result).toEqual([{
      id: selectedIssue,
      title,
      type: issueType.toLowerCase(),
    }]);
  });

  it('extracts tickets from the issues tab', async () => {
    const result = await scan(loc('my-subdomain.atlassian.net', `/projects/RC/issues/${selectedIssue}`, { filter: 'something' }));

    expect(api.get).toHaveBeenCalledWith(`issue/${selectedIssue}`);
    expect(result).toEqual([{
      id: selectedIssue,
      title,
      type: issueType.toLowerCase(),
    }]);
  });

  it('extracts tickets when browsing an issue', async () => {
    const result = await scan(loc('my-subdomain.atlassian.net', `/browse/${selectedIssue}`));

    expect(api.get).toHaveBeenCalledWith(`issue/${selectedIssue}`);
    expect(result).toEqual([{
      id: selectedIssue,
      title,
      type: issueType.toLowerCase(),
    }]);
  });
});
