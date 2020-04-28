import { shallow } from 'enzyme';
import React, { useContext } from 'react';

import EnvContext from '../env-context';
import CopyButton from './copy-button';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

describe('copy-button', () => {
  function render(overrides, env) {
    useContext.mockReturnValue(env);
    const defaults = { value: 'copy text' };
    const props = { ...defaults, ...overrides };
    return shallow(<CopyButton {...props} />);
  }

  let pbcopy;

  beforeEach(() => {
    useContext.mockReset();
    pbcopy = jest.fn();
  });

  it('uses the env context', () => {
    render({}, { pbcopy }); // render to check use of context
    expect(useContext).toHaveBeenCalledWith(EnvContext);
  });

  it('calls the context pbcopy function with the provided value on click', () => {
    const value = 'a lot of value for such a small button';
    const wrapper = render({ value }, { pbcopy });
    wrapper.simulate('click');
    expect(pbcopy).toHaveBeenCalledWith(value);
  });

  it('passes on any other properties to the rendered button', () => {
    const wrapper = render(
      { value: '0x2a', 'data-weirdo': 'yes, please' },
      { pbcopy }
    );
    expect(wrapper.find('button').prop('data-weirdo')).toBe('yes, please');
  });
});
