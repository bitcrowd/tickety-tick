import serializable from './serializable-errors';

describe('serializable-errors', () => {
  const error = new Error('Serialized Test Error');

  let representation;

  function roundtrip(value) {
    return JSON.parse(JSON.stringify(value));
  }

  beforeEach(() => {
    representation = serializable(error);
  });

  it('returns a JSON-serializable error representation', () => {
    expect(roundtrip(representation)).toEqual(representation);
  });

  it('includes the error message', () => {
    expect(representation.message).toBe(error.message);
  });

  it('includes the error stack trace', () => {
    expect(representation.stack).toBe(error.stack);
  });
});
