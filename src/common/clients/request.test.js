import { get, HTTPError } from 'ky';

import request from './request';

class MockHeaders {
  constructor(headers) {
    this.headers = headers;
  }

  get(header) {
    return this.headers[header];
  }
}

class MockResponse {
  constructor(body, status = 200, headers = {}) {
    this.headers = new MockHeaders(headers);
    this.ok = status < 300 && status >= 200;
    this.status = status;
    this.body = body;
  }

  text() {
    return Promise.resolve(this.body);
  }

  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
}

jest.mock('ky', () => ({
  get: jest.fn(),
}));

describe('request', () => {
  beforeEach(() => {
    get.mockImplementation(() => new MockResponse('{}', 200));
  });

  afterEach(() => {
    get.mockClear();
  });

  it('performs an HTTP request against the given endpoint', () => {
    const searchParams = { a: 0, b: 1, c: 2 };
    const path = 'https://path/to/resource';
    request(path, { searchParams });

    expect(get).toHaveBeenCalledWith(path, expect.objectContaining({ searchParams }));
  });

  it('performs an HTTP request with the proper headers by default', () => {
    const path = 'https://path/to/resource';
    request(path);

    expect(get).toHaveBeenCalledWith(path, expect.objectContaining({
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
      },
    }));
  });

  it('sets extra options on request', () => {
    const prefixUrl = 'https://www.bitcrowd.net/';
    request('resource', { prefixUrl });

    expect(get).toHaveBeenCalledWith('resource', expect.objectContaining({
      prefixUrl,
    }));
  });

  it('sends cookies for any domain', () => {
    const path = 'https://path/to/resource';
    request(path);
    expect(get).toHaveBeenCalledWith(path, expect.objectContaining({
      credentials: 'include',
    }));
  });

  it('parses JSON responses on success', async () => {
    const body = JSON.stringify({ life: 42 });
    get.mockImplementation(() => new MockResponse(body, 200));

    const result = await request('https://test-json');
    expect(result).toEqual(JSON.parse(body));
  });

  it('rejects with an error on failure', () => {
    const body = JSON.stringify({ status: 401, message: 'Unauthorized' });
    get.mockImplementation(() => {
      const response = new MockResponse(body, 401);
      throw new HTTPError(response);
    });

    expect(() => request('https://test-error')).toThrowError(HTTPError);
  });
});
