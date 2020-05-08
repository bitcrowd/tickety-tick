import client from '../client';
import loc from './__helpers__/location';
import scan from './trello';

jest.mock('../client');

const key = 'haKn65Sy';

const shortLink = key;
const name = 'A quick summary of the card';
const slug = '4-a-quick-summary-of-the-card';
const desc = 'A detailed description of the card';
const shortUrl = `https://trello.com/c/${shortLink}`;

const response = {
  desc,
  name,
  shortLink,
  shortUrl,
};

const ticket = {
  id: shortLink,
  title: name,
  description: desc,
  url: shortUrl,
  type: 'feature',
};

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

  it('returns an empty array if it is on a different domain', async () => {
    const result = await scan(loc('other.com', `/c/${key}/${slug}`));
    expect(result).toEqual([]);
  });

  it('returns an empty array if it is on a different path', async () => {
    const result = await scan(loc('trello.com', '/another/url'));
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('uses the correct endpoint', async () => {
    await scan(loc('trello.com', '/c/aghy1jdk/1-ticket-title'));
    expect(client).toHaveBeenCalledWith('https://trello.com/1');
    expect(api.get).toHaveBeenCalled();
  });

  it('extracts tickets from the current card', async () => {
    const result = await scan(loc('trello.com', `/c/${key}/${slug}`));
    expect(client).toHaveBeenCalledWith('https://trello.com/1');
    expect(api.get).toHaveBeenCalledWith(`cards/${key}`, {
      searchParams: { fields: 'name,desc,shortLink,shortUrl' },
    });
    expect(result).toEqual([ticket]);
  });
});
