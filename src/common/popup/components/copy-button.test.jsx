import React from 'react';
import { shallow } from 'enzyme';

import EnvContext from '../env-context';

import CopyButton from './copy-button';

describe('copy-button', () => {
  function render(overrides, env) {
    const defaults = { value: 'copy text' };

    const props = { ...defaults, ...overrides };

    // Enzyme does not fully support the new React Context API at the moment.
    // We work around this limitation by directly passing in the context value
    // to the `EnvContext.Consumer` child function for rendering.
    //
    // See https://github.com/airbnb/enzyme/issues/1553.
    const outer = shallow(<CopyButton {...props} />);
    const children = outer.find(EnvContext.Consumer).prop('children');
    const wrapper = shallow(children(env));

    return wrapper;
  }

  let grab;

  beforeEach(() => {
    grab = jest.fn();
  });

  it('calls the context grab function with the provided value on click', () => {
    const value = 'a lot of value for such a small button';
    const wrapper = render({ value }, { grab });
    wrapper.simulate('click');
    expect(grab).toHaveBeenCalledWith(value);
  });

  it('passes on any other properties to the rendered button', () => {
    const wrapper = render({ value: '0x2a', 'data-weirdo': 'yes, please' }, { grab });
    expect(wrapper.find('button').prop('data-weirdo')).toBe('yes, please');
  });
});
