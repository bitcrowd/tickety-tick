import qs from 'qs';

import jira from '../clients/jira';
import scan from './jira';

jest.mock('../clients/jira', () => jest.fn());

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

const requestMock = jest.fn(() => response);

describe('jira adapter', () => {
  function loc(host, pathname = '', params = {}) {
    const search = qs.stringify(params);
    const href = params
      ? `https://${host}${pathname}?${search}`
      : `https://${host}${pathname}`;

    return {
      host,
      href,
      pathname,
      search,
    };
  }

  beforeEach(() => {
    jira.mockImplementation(() => ({
      request: requestMock,
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
