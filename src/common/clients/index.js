import qs from 'qs';

const defaults = { credentials: 'include' };

const defaultHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  Accept: 'application/json',
};

function configure(method, options) {
  const { data, headers: customHeaders, ...extras } = options;
  const headers = { ...defaultHeaders, ...customHeaders };
  const body = data ? JSON.stringify(data) : null;
  const overrides = {
    method, headers, body, ...extras,
  };

  return { ...defaults, ...overrides };
}

function process(response) {
  return response.json().then((json) => {
    if (!response.ok) {
      const { message } = json;
      const error = new Error(message);
      error.status = response.status;
      error.data = json;
      throw error;
    }

    return json;
  });
}

class Client {
  constructor(base) {
    this.base = base;
  }

  resolve(path, params = {}) {
    const query = qs.stringify(params);
    const url = `${this.base}/${path}`;
    return query ? `${url}?${query}` : url;
  }

  request(method, endpoint, options = {}) {
    const { params, ...settings } = options;
    const url = this.resolve(endpoint, params);
    const config = configure(method, settings);
    return fetch(url, config).then(process);
  }
}

export default Client;
