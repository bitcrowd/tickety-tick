import pbcopy from 'copy-text-to-clipboard';
import { shallow } from 'enzyme';
import React from 'react';

import CopyButton from './copy-button';

jest.mock('copy-text-to-clipboard');
jest.useFakeTimers();

describe('copy-button', () => {
  function render(overrides) {
    const defaults = { value: 'copy text' };
    const props = { ...defaults, ...overrides };
    return shallow(<CopyButton {...props} />);
  }

  let close;

  beforeEach(() => {
    close = jest.spyOn(window, 'close').mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllTimers();
    close.mockRestore();
  });

  it('renders its children', () => {
    const children = 'button content';
    const wrapper = render({ children });
    expect(wrapper.contains(children)).toBe(true);
  });

  it('passes the "copied" state to its children if they are a function', () => {
    const children = jest.fn();
    const wrapper = render({ children });
    expect(children).toHaveBeenNthCalledWith(1, false);

    wrapper.simulate('click');

    expect(children).toHaveBeenNthCalledWith(2, true);
  });

  it('calls the context pbcopy function with the provided value on click', () => {
    const value = 'a lot of value for such a small button';
    const wrapper = render({ value });
    wrapper.simulate('click');
    expect(pbcopy).toHaveBeenCalledWith(value);
  });

  it('calls the context close function delayed after the value was copied', () => {
    const value = 'a lot of value for such a small button';
    const wrapper = render({ value });
    wrapper.simulate('click');
    expect(pbcopy).toHaveBeenCalledWith(value);
    expect(close).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(close).toHaveBeenCalled();
  });

  it('passes on any other properties to the rendered button', () => {
    const wrapper = render({ value: '0x2a', 'data-weirdo': 'yes, please' });
    expect(wrapper.find('button').prop('data-weirdo')).toBe('yes, please');
  });
});
