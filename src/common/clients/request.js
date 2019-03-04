import ky from 'ky';

const defaultHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  Accept: 'application/json',
};

function request(endpoint, customOptions = {}) {
  const options = {
    credentials: 'include',
    headers: defaultHeaders,
    ...customOptions,
  };

  return ky.get(endpoint, options).json();
}

export default request;
