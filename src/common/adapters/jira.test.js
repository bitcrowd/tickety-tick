import client from '../client';
import scan from './jira';

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

jest.mock('../client', () => jest.fn());

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

  const requestMock = jest.fn(() => ({
    json: () => response,
  }));

  beforeEach(() => {
    client.mockImplementation(() => ({
      get: requestMock,
    }));
  });

  afterEach(() => {
    requestMock.mockClear();
  });

  it('returns null when on a different host', async () => {
    const result = await scan(loc('another-domain.com'));
    expect(requestMock).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });

  it('returns null when the selected issue is missing', async () => {
    const result = await scan(loc('my-subdomain.atlassian.com'));
    expect(requestMock).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });

  describe('when viewing the active sprints tab', () => {
    it('returns the ticket id, title and summary', async () => {
      const result = await scan(loc('my-subdomain.atlassian.net', '', { selectedIssue }));

      expect(requestMock).toHaveBeenCalledWith(`issue/${selectedIssue}`);
      expect(result).toEqual([{
        id: selectedIssue,
        title,
        type: issueType.toLowerCase(),
      }]);
    });
  });

  describe('when viewing the issues tab', () => {
    it('returns the ticket id, title and summary', async () => {
      const result = await scan(loc('my-subdomain.atlassian.net', `/projects/RC/issues/${selectedIssue}`, { filter: 'something' }));

      expect(requestMock).toHaveBeenCalledWith(`issue/${selectedIssue}`);
      expect(result).toEqual([{
        id: selectedIssue,
        title,
        type: issueType.toLowerCase(),
      }]);
    });
  });

  describe('when browsing an issue', () => {
    it('returns the ticket id, title and summary', async () => {
      const result = await scan(loc('my-subdomain.atlassian.net', `/browse/${selectedIssue}`));

      expect(requestMock).toHaveBeenCalledWith(`issue/${selectedIssue}`);
      expect(result).toEqual([{
        id: selectedIssue,
        title,
        type: issueType.toLowerCase(),
      }]);
    });
  });
});
