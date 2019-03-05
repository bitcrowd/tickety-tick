import client from '../client';
import scan from './trello';

import loc from './__helpers__/location';

jest.mock('../client', () => jest.fn());

const key = 'haKn65Sy';

const idShort = '123';
const name = 'A quick summary of the card';
const slug = '123-a-quick-summary-of-the-card';

const response = { idShort, name };

describe('trello adapter', () => {
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
    const result = await scan(loc('another-domain.com'));
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });

  it('returns null when on a different view', async () => {
    const result = await scan(loc('trello.com', '/another/url'));
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });

  it('uses the correct endpoint', async () => {
    await scan(loc('trello.com', '/c/aghy1jdk/1-ticket-title'));
    expect(client).toHaveBeenCalledWith('https://trello.com/1');
    expect(api.get).toHaveBeenCalled();
  });

  it('extracts tickets from the current card', async () => {
    const result = await scan(loc('trello.com', `/c/${key}/${slug}`));
    expect(client).toHaveBeenCalledWith('https://trello.com/1');
    expect(api.get).toHaveBeenCalledWith(`cards/${key}`);
    expect(result).toEqual([{ id: idShort, title: name, type: 'feature' }]);
  });
});
