import client from '../client';
import loc from './__helpers__/location';
import scan from './notion';

jest.mock('../client', () => jest.fn());

describe('notion adapter', () => {
  const id = '5b1d7dd7-9107-4890-b2ec-83175b8eda83';
  const title = 'Add notion.so support';
  const slugId = '5b1d7dd791074890b2ec83175b8eda83';
  const slug = `Add-notion-so-support-${slugId}`;
  const response = {
    results: [
      {
        role: 'editor',
        value: {
          id,
          type: 'page',
          properties: { title: [[title]] },
        },
      },
    ],
  };

  const ticket = { id, title, type: 'page' };
  const api = { post: jest.fn() };

  beforeEach(() => {
    api.post.mockReturnValue({ json: () => response });
    client.mockReturnValue(api);
  });

  afterEach(() => {
    api.post.mockReset();
    client.mockReset();
  });

  it('returns an empty array when not on a www.notion.so page', async () => {
    const result = await scan(loc('another-domain.com'));
    expect(api.post).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('uses the notion.so api', async () => {
    const location = loc('www.notion.so', `/notionuser/${slug}`);
    await scan(location);
    expect(client).toHaveBeenCalledWith('https://www.notion.so');
    expect(api.post).toHaveBeenCalled();
  });

  it('returns an empty array when the current page is a board view', async () => {
    const res = {
      results: [
        {
          role: 'editor',
          value: { id, type: 'collection_view_page' },
        },
      ],
    };
    api.post.mockReturnValueOnce({ json: () => res });

    const location = loc(
      'www.notion.so',
      `/notionuser/${slugId}`,
      '?v=77ff97cab6ff4beab7fa6e27f992dd5e'
    );
    const result = await scan(location);
    const request = { requests: [{ table: 'block', id }] };
    expect(api.post).toHaveBeenCalledWith('api/v3/getRecordValues', {
      json: request,
    });
    expect(result).toEqual([]);
  });

  it('returns an emtpy array when the page does not exist', async () => {
    const res = { results: [{ role: 'editor' }] };
    api.post.mockReturnValueOnce({ json: () => res });

    const location = loc('www.notion.so', `/notionuser/${slug}`);
    const result = await scan(location);
    const request = { requests: [{ table: 'block', id }] };
    expect(api.post).toHaveBeenCalledWith('api/v3/getRecordValues', {
      json: request,
    });
    expect(result).toEqual([]);
  });

  it('extracts tickets from page modals (board view)', async () => {
    const location = loc(
      'www.notion.so',
      '/notionuser/0e8608aa770a4d36a246d7a3c64f51af',
      `?v=77ff97cab6ff4beab7fa6e27f992dd5e&p=${slugId}`
    );
    const result = await scan(location);
    const request = { requests: [{ table: 'block', id }] };
    expect(api.post).toHaveBeenCalledWith('api/v3/getRecordValues', {
      json: request,
    });
    expect(result).toEqual([ticket]);
  });

  it('extracts tickets from the page view', async () => {
    const location = loc('www.notion.so', `/notionuser/${slug}`);
    const result = await scan(location);
    const request = { requests: [{ table: 'block', id }] };
    expect(api.post).toHaveBeenCalledWith('api/v3/getRecordValues', {
      json: request,
    });
    expect(result).toEqual([ticket]);
  });
});
