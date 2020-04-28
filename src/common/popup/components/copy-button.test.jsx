import { shallow } from 'enzyme';
import React, { useContext } from 'react';

import EnvContext from '../env-context';
import CopyButton from './copy-button';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));
jest.useFakeTimers();

describe('copy-button', () => {
  function render(overrides, env) {
    useContext.mockReturnValue(env);
    const defaults = { value: 'copy text' };
    const props = { ...defaults, ...overrides };
    return shallow(<CopyButton {...props} />);
  }

  let pbcopy;
  let close;

  beforeEach(() => {
    useContext.mockReset();
    pbcopy = jest.fn();
    close = jest.fn();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('uses the env context', () => {
    render({}, { pbcopy }); // render to check use of context
    expect(useContext).toHaveBeenCalledWith(EnvContext);
  });

  it('renders its children', () => {
    const children = 'button content';
    const wrapper = render({ children }, { pbcopy });
    expect(wrapper.contains(children)).toBe(true);
  });

  it('passes the "copied" state to its children if they are a function', () => {
    const children = jest.fn();
    const wrapper = render({ children }, { pbcopy });
    expect(children).toHaveBeenNthCalledWith(1, false);

    wrapper.simulate('click');

    expect(children).toHaveBeenNthCalledWith(2, true);
  });

  it('calls the context pbcopy function with the provided value on click', () => {
    const value = 'a lot of value for such a small button';
    const wrapper = render({ value }, { pbcopy });
    wrapper.simulate('click');
    expect(pbcopy).toHaveBeenCalledWith(value);
  });

  it('calls the context close function delayed after the value was copied', () => {
    const value = 'a lot of value for such a small button';
    const wrapper = render({ value }, { pbcopy, close });
    wrapper.simulate('click');
    expect(pbcopy).toHaveBeenCalledWith(value);
    expect(close).not.toHaveBeenCalled();

    jest.advanceTimersByTime(700);
    expect(close).toHaveBeenCalled();
  });

  it('passes on any other properties to the rendered button', () => {
    const wrapper = render(
      { value: '0x2a', 'data-weirdo': 'yes, please' },
      { pbcopy }
    );
    expect(wrapper.find('button').prop('data-weirdo')).toBe('yes, please');
  });
});
