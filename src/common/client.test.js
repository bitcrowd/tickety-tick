import ky from 'ky';

import client from './client';

jest.mock('ky', () => ({
  extend: jest.fn(),
}));

describe('client', () => {
  const mock = { ky: true };

  beforeEach(() => {
    ky.extend.mockReturnValue(mock);
  });

  afterEach(() => {
    ky.extend.mockReset();
  });

  it('creates a new client with default values', () => {
    const instance = client('https://example.io/api');
    expect(ky.extend.mock.calls).toMatchSnapshot();
    expect(instance).toBe(mock);
  });

  it('sets custom options', () => {
    const instance = client('https://example.io/api', {
      credentials: 'same-origin',
      timeout: 1000,
    });
    expect(ky.extend.mock.calls).toMatchSnapshot();
    expect(instance).toBe(mock);
  });
});
