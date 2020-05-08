import ky from 'ky';

const credentials = 'include';

const headers = {
  'content-type': 'application/json; charset=utf-8',
  accept: 'application/json',
};

const timeout = 1000;

function client(base, options = {}) {
  return ky.extend({
    prefixUrl: base,
    credentials,
    headers,
    timeout,
    ...options,
  });
}

export default client;
