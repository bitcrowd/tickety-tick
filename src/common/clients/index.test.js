import qs from 'qs';

import Client from '.';

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

describe('Client', () => {
  function url(fn) {
    const args = fn.mock.calls[0];
    return args[0];
  }

  function option(fn, name) {
    const args = fn.mock.calls[0];
    const options = args[1];
    return options[name];
  }

  const base = 'https://my-backlog.bitcrowd.net/api/1.0';

  let client;
  let fetch;

  beforeEach(() => {
    fetch = jest.spyOn(global, 'fetch');
    fetch.mockResolvedValue(new MockResponse('{}'));
    client = new Client(base);
  });

  afterEach(() => {
    fetch.mockRestore();
  });

  describe('resolve()', () => {
    it('constructs a URL relative to the base URL', () => {
      const resolved = client.resolve('some-resource');
      expect(resolved).toBe(`${base}/some-resource`);
    });

    it('stringifies query parameters', () => {
      const params = { q: 'xyz', p: '0' };
      const resolved = client.resolve('resource', params);
      expect(resolved.startsWith(`${base}/resource?`)).toBe(true);
      const querystring = resolved.match(/\?([^?]+)$/)[1];
      expect(qs.parse(querystring)).toEqual(params);
    });
  });

  describe('request()', () => {
    beforeEach(() => {
      fetch.mockResolvedValue(new MockResponse('{}'));
    });

    it('performs an HTTP request with the given HTTP method', () => {
      client.request('SOME-METHOD', 'resource');
      expect(option(fetch, 'method')).toBe('SOME-METHOD');
    });

    it('performs an HTTP request against the resolved URL', () => {
      const resolve = jest.spyOn(client, 'resolve').mockReturnValue('resolved-url?q=1');
      const params = { a: 0, b: 1, c: 2 };
      const path = 'path/to/resource';
      client.request('GET', path, { params });
      expect(resolve).toHaveBeenCalledWith(path, params);
      expect(url(fetch)).toBe('resolved-url?q=1');
    });

    it('serializes request data', () => {
      const data = { a: 0, b: '123' };
      client.request('POST', 'resource', { data });
      expect(option(fetch, 'body')).toBe(JSON.stringify(data));
    });

    it('sets default HTTP headers on request', () => {
      client.request('GET', 'resource');
      const headers = option(fetch, 'headers');
      expect(headers['Accept']).toBe('application/json'); // eslint-disable-line dot-notation
      expect(headers['Content-Type']).toBe('application/json; charset=utf-8');
    });

    it('sets custom HTTP headers on request', () => {
      client.request('GET', 'resource', { headers: { 'X-Header': 'Y-Value' } });
      const headers = option(fetch, 'headers');
      expect(headers['Accept']).toBe('application/json'); // eslint-disable-line dot-notation
      expect(headers['Content-Type']).toBe('application/json; charset=utf-8');
      expect(headers['X-Header']).toBe('Y-Value');
    });

    it('sets extra options on request', () => {
      const signal = jest.fn();
      client.request('GET', 'resource', { signal });
      expect(option(fetch, 'signal')).toBe(signal);
    });

    it('sends cookies for any domain', () => {
      client.request('GET', 'resource');
      expect(option(fetch, 'credentials')).toBe('include');
    });

    it('parses JSON responses on success', async () => {
      const body = JSON.stringify({ life: 42 });
      fetch.mockResolvedValue(new MockResponse(body, 200));
      const result = await client.request('GET', 'test/json');
      expect(result).toEqual(JSON.parse(body));
    });

    it('rejects with an error on failure', async () => {
      const body = JSON.stringify({ status: 401, message: 'Unauthorized' });
      fetch.mockResolvedValue(new MockResponse(body, 401));

      let rejected = false;

      try {
        await client.request('GET', 'test/error');
      } catch (error) {
        expect(error.message).toBe('Unauthorized');
        expect(error.data).toEqual(JSON.parse(body));
        expect(error.status).toBe(401);

        rejected = true;
      }

      expect(rejected).toBe(true);
    });
  });
});
