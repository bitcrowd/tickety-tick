import request from './request';

class Client {
  constructor(host) {
    this.base = `https://${host}/rest/agile/1.0`;
  }

  request(endpoint, options = {}) {
    return request(endpoint, { prefixUrl: this.base, ...options });
  }
}

export default Client;
