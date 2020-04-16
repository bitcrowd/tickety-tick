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

  let grab;

  beforeEach(() => {
    useContext.mockReset();
    grab = jest.fn();
  });

  it('uses the env context', () => {
    render({}, { grab }); // render to check use of context
    expect(useContext).toHaveBeenCalledWith(EnvContext);
  });

  it('calls the context grab function with the provided value on click', () => {
    const value = 'a lot of value for such a small button';
    const wrapper = render({ value }, { grab });
    wrapper.simulate('click');
    expect(grab).toHaveBeenCalledWith(value);
  });

  it('passes on any other properties to the rendered button', () => {
    const wrapper = render(
      { value: '0x2a', 'data-weirdo': 'yes, please' },
      { grab }
    );
    expect(wrapper.find('button').prop('data-weirdo')).toBe('yes, please');
  });
});
