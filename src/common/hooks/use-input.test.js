import { useState } from 'react';

import useInput from './use-input';

jest.mock('react');

describe('use-input', () => {
  beforeEach(() => {
    useState.mockReset();
  });

  it('receives an initial value and tracks updates', () => {
    const setValue = jest.fn();
    useState.mockImplementation((value) => [value, setValue]);

    const { value, onChange } = useInput('initial');

    expect(value).toBe('initial');

    const event = { target: { value: 'updated' } };
    onChange(event);

    expect(setValue).toHaveBeenCalledWith('updated');
  });
});
