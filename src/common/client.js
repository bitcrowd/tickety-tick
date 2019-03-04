import ky from 'ky';

const credentials = 'include';

const headers = {
  'content-type': 'application/json; charset=utf-8',
  accept: 'application/json',
};

function client(base, options = {}) {
  return ky.extend({
    credentials, headers, prefixUrl: base, timeout: 1000, ...options,
  });
}

export default client;
