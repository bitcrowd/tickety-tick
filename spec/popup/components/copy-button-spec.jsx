import React from 'react';
import { shallow } from 'enzyme';

import CopyButton from '../../../src/common/popup/components/copy-button';

describe('copy-button', () => {
  let context;

  beforeEach(() => {
    context = { grab: jasmine.createSpy('grab') };
  });

  it('calls the context grab function with the provided value on click', () => {
    const value = 'a lot of value for such a small button';
    const wrapper = shallow(<CopyButton value={value} />, { context });
    wrapper.simulate('click');
    expect(context.grab).toHaveBeenCalledWith(value);
  });

  it('passes on any other properties to the rendered button', () => {
    const wrapper = shallow(<CopyButton value="0x2a" data-weirdo="yes, please" />, { context });
    expect(wrapper.find('button').prop('data-weirdo')).toBe('yes, please');
  });
});
